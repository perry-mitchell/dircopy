import { resolveSourceForDetails, Source } from "./source.js";
import { expandSourceURI, SourceDetails, SourceType } from "./uri.js";

export interface SyncSourcesOptions {
    removeSourceCopy?: boolean;
}

export async function syncSources(source: string, destination: string, options?: SyncSourcesOptions): Promise<void>;
export async function syncSources(source: SourceDetails, destination: SourceDetails, options?: SyncSourcesOptions): Promise<void>;
export async function syncSources(source: Source, destination: Source, options?: SyncSourcesOptions): Promise<void>;
export async function syncSources(source: Source | SourceDetails | string, destination: Source | SourceDetails | string, options: SyncSourcesOptions = {}): Promise<void> {
    let resolvedSource: Source,
        resolvedDestination: Source;
    if (typeof source === "string" && typeof destination === "string") {
        resolvedSource = resolveSourceForDetails(expandSourceURI(source, {
            removeSourceCopy: !!options.removeSourceCopy
        }));
        resolvedDestination = resolveSourceForDetails(expandSourceURI(destination, {
            removeSourceCopy: !!options.removeSourceCopy
        }));
    } else if (
        (typeof source === "object" && Object.values(SourceType).includes(source?.type)) &&
        (typeof destination === "object" && Object.values(SourceType).includes(destination?.type))
    ) {
        resolvedSource = resolveSourceForDetails(source as SourceDetails);
        resolvedDestination = resolveSourceForDetails(destination as SourceDetails);
    } else {
        resolvedSource = source as Source;
        resolvedDestination = destination as Source;
    }
    // Sync
    return resolvedSource.syncTo(resolvedDestination);
}
