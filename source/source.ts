import { Readable, Writable } from "node:stream";
import { createFSSource } from "./sources/fs.js";
import { createWebDAVSource } from "./sources/webdav.js";
import { FileSystemSourceDetails, SourceDetails, SourceType, WebDAVSourceDetails } from "./uri.js";

export interface SourceFile {
    filename: string,
    name: string;
    type: SourceType;
}

export interface Source {
    deleteDirectory: (directory: string) => Promise<void>;
    deleteFile: (file: string) => Promise<void>;
    getDirectoryContents: (directory: string) => Promise<Array<SourceFile>>;
    getReadStream: (filename: string) => Promise<Readable>;
    getWriteStream: (filename: string) => Promise<Writable>;
    removeSourceCopy: boolean;
    root: string;
    syncTo: (source: Source) => Promise<void>;
    type: SourceType;
}

export function resolveSourceForDetails(details: SourceDetails): Source {
    if (details.type === "webdav") {
        return createWebDAVSource(details as WebDAVSourceDetails);
    } else if (details.type === "fs") {
        return createFSSource(details as FileSystemSourceDetails);
    }
    throw new Error(`Unrecognised type: ${details.type}`);
}
