import ms from "ms";

export interface EnvConfig {
    delayMS: number;
    removeSourceCopy: boolean;
    sourceURI: string;
    targetURI: string;
}

export function getEnvConfig(): EnvConfig {
    const {
        DELAY = "5m",
        REMOVE_SOURCE_COPY = "0",
        SOURCE,
        TARGET
    } = process.env;
    return {
        delayMS: ms(DELAY),
        removeSourceCopy: parseInt(REMOVE_SOURCE_COPY, 10) === 1,
        sourceURI: SOURCE,
        targetURI: TARGET
    };
}
