import { SourceDetails, SourceType } from "./uri.js";

interface Source {
    syncTo: (source: Source) => Promise<void>;
    type: SourceType;
}

export function resolveSourceForDetails(details: SourceDetails): Source {
    if (details.type === "webdav") {

    } else if (details.type === "fs") {

    }
    throw new Error(`Unrecognised type: ${details.type}`);
}
