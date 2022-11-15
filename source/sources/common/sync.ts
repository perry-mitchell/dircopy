import path from "node:path";
import { Source } from "../../source.js";
import { waitForStreamEnd } from "../../util.js";

export async function syncDirectory(
    local: Source,
    localPath: string,
    remote: Source,
    remotePath: string
): Promise<void> {
    const [localContents, remoteContents] = await Promise.all([
        local.getDirectoryContents(localPath),
        remote.getDirectoryContents(remotePath)
    ]);
    for (const localItem of localContents) {
        const remoteItem = remoteContents.find(ri => ri.name === localItem.name);
        if (remoteItem?.type === "directory" && localItem.type === "file") {
            await remote.deleteDirectory(remoteItem.filename);
            await syncFile(local, localItem.filename, remote, remoteItem.filename);
        } else if (remoteItem?.type === "file" && localItem.type === "directory") {
            await remote.deleteFile(remoteItem.filename);
            await syncDirectory(local, localItem.filename, remote, path.join(remotePath, localItem.name));
        } else if (localItem.type === "file") {
            await syncFile(local, localItem.filename, remote, path.join(remotePath, localItem.name));
        } else if (localItem.type === "directory") {
            await syncDirectory(local, localItem.filename, remote, path.join(remotePath, localItem.name));
        }
        if (local.removeSourceCopy) {
            if (localItem.type === "file") {
                await local.deleteFile(localItem.filename);
            } else {
                await local.deleteDirectory(localItem.filename);
            }
        }
    }
}

async function syncFile(local: Source, localFilename: string, remote: Source, remoteFilename: string): Promise<void> {
    const localFs = await local.getReadStream(localFilename);
    const remoteFs = await remote.getWriteStream(remoteFilename);
    const str = localFs.pipe(remoteFs);
    await waitForStreamEnd(str);
}
