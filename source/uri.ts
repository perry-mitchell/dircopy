import { parse } from "url";

export interface SourceDetails {
    path: string;
    type: SourceType;
}

export type SourceType = "fs" | "webdav";

export interface FileSystemSourceDetails extends SourceDetails {}

export interface WebDAVSourceDetails extends SourceDetails {
    host: string;
    password?: string;
    port: number;
    username?: string;
}

export function expandSourceURI(uri: string): FileSystemSourceDetails | WebDAVSourceDetails {
    const {
        auth,
        host,
        path,
        port,
        protocol
    } = parse(uri);
    if (protocol.toLowerCase() === "webdav:") {
        const [username = null, password = null] = (auth ?? "").split(":", 2);
        const output: WebDAVSourceDetails = {
            host,
            password,
            path,
            port: parseInt(port, 10),
            type: "webdav",
            username
        };
        return output;
    }
    return {
        path,
        type: "fs"
    };
}
