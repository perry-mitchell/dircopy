import { createReadStream, createWriteStream } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { Readable, Writable } from "node:stream";
import { Source, SourceFile } from "../source.js";
import { FileSystemSourceDetails, SourceType } from "../uri.js";
import { syncDirectory } from "./common/sync.js";

export function createFSSource(details: FileSystemSourceDetails): Source {
    const source: Source = {
        deleteDirectory,
        deleteFile,
        getDirectoryContents,
        getReadStream,
        getWriteStream,
        removeSourceCopy: details.removeSourceCopy,
        root: details.path,
        syncTo: (target: Source) => syncTo(source, target),
        type: SourceType.FileSystem
    };
    return source;
}

async function deleteDirectory(directory: string): Promise<void> {
    await fs.rm(directory, { recursive: true, force: true });
}

async function deleteFile(filename: string): Promise<void> {
    await fs.rm(filename, { force: true });
}

async function getDirectoryContents(directory: string): Promise<Array<SourceFile>> {
    const items = await fs.readdir(directory, { withFileTypes: true });
    return items.reduce((output, item) => {
        const isDir = item.isDirectory();
        const isFile = item.isFile();
        if (!isDir && !isFile) {
            return output;
        }
        return [
            ...output,
            {
                filename: path.join(directory, item.name),
                name: item.name,
                type: isDir ? "directory" : "file"
            }
        ];
    }, []);
}

async function getReadStream(filename: string): Promise<Readable> {
    return createReadStream(filename);
}

async function getWriteStream(filename: string): Promise<Writable> {
    return createWriteStream(filename);
}

async function syncTo(local: Source, remote: Source): Promise<void> {
    return syncDirectory(local, local.root, remote, remote.root);
}
