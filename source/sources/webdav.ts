import path from "node:path";
import { Readable, Writable } from "node:stream";
import { createClient, FileStat, WebDAVClient, WebDAVClientOptions } from "webdav";
import { Source, SourceFile } from "../source.js";
import { SourceType, WebDAVSourceDetails } from "../uri.js";
import { syncDirectory } from "./common/sync.js";

export function createWebDAVSource(details: WebDAVSourceDetails): Source {
    const proto = details.port === 443 ? "https" : "http";
    let webdavOptions: WebDAVClientOptions = {};
    if (details.username && details.password) {
        webdavOptions = {
            ...webdavOptions,
            username: details.username,
            password: details.password
        };
    }
    const webdav = createClient(`${proto}://${details.host}:${details.port}${details.urlPath}`, webdavOptions);
    const source: Source = {
        deleteDirectory: (directory: string) => deleteDirectory(webdav, directory),
        deleteFile: (directory: string) => deleteFile(webdav, directory),
        getDirectoryContents: (directory: string) => getDirectoryContents(webdav, directory),
        getReadStream: (filename: string) => getReadStream(webdav, filename),
        getWriteStream: (filename: string) => getWriteStream(webdav, filename),
        removeSourceCopy: details.removeSourceCopy,
        root: details.path,
        syncTo: (target: Source) => syncTo(source, target),
        type: SourceType.WebDAV
    };
    return source;
}

async function deleteDirectory(webdav: WebDAVClient, directory: string): Promise<void> {
    await webdav.deleteFile(directory);
}

async function deleteFile(webdav: WebDAVClient, filename: string): Promise<void> {
    await webdav.deleteFile(filename);
}

async function getDirectoryContents(webdav: WebDAVClient, directory: string): Promise<Array<SourceFile>> {
    const items = await webdav.getDirectoryContents(directory) as Array<FileStat>;
    return items.reduce((output, item) => {
        return [
            ...output,
            {
                filename: path.join(directory, item.filename),
                name: item.filename,
                type: item.type
            }
        ];
    }, []);
}

async function getReadStream(webdav: WebDAVClient, filename: string): Promise<Readable> {
    return webdav.createReadStream(filename);
}

async function getWriteStream(webdav: WebDAVClient, filename: string): Promise<Writable> {
    return webdav.createWriteStream(filename);
}

async function syncTo(local: Source, remote: Source): Promise<void> {
    return syncDirectory(local, local.root, remote, remote.root);
}
