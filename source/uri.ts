import { parse } from "url";

export interface SourceDetails {
    path: string;
    removeSourceCopy: boolean;
    type: SourceType;
}

export enum SourceType {
    FileSystem = "fs",
    WebDAV = "webdav"
}

export interface FileSystemSourceDetails extends SourceDetails {}

export interface WebDAVSourceDetails extends SourceDetails {
    host: string;
    password?: string;
    port: number;
    urlPath: string,
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
        path: urlPath = "/",
        port,
        protocol,
        query = {}
    } = parse(uri, true);
    const filePath = query?.path ? Array.isArray(query.path) ? query.path[0] : query.path : null;
    if (protocol.toLowerCase() === "webdav:") {
        const [username = null, password = null] = (auth ?? "").split(":", 2);
        const output: WebDAVSourceDetails = {
            host,
            password,
            path: filePath || "/",
            urlPath,
            port: parseInt(port, 10),
            removeSourceCopy,
            type: SourceType.WebDAV,
            username
        };
        return output;
    }
    return {
        path: filePath || urlPath || "/",
        removeSourceCopy,
        type: SourceType.FileSystem
    };
}
