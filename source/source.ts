import { Readable, Writable } from "node:stream";
import { SourceDetails, SourceType } from "./uri.js";

export interface SourceFile {
    filename: string,
    name: string;
    type: "file" | "directory"
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

    } else if (details.type === "fs") {

    }
    throw new Error(`Unrecognised type: ${details.type}`);
}
