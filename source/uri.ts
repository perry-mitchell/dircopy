import { parse } from "url";

export interface SourceDetails {
    path: string;
    removeSourceCopy: boolean;
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

export function expandSourceURI(
    uri: string,
    {
        removeSourceCopy = false
    }: {
        removeSourceCopy?: boolean
    } = {}
): FileSystemSourceDetails | WebDAVSourceDetails {
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
            removeSourceCopy,
            type: "webdav",
            username
        };
        return output;
    }
    return {
        path,
        removeSourceCopy,
        type: "fs"
    };
}
