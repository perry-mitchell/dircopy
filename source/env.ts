import ms from "ms";

export interface EnvConfig {
    delayMS: number;
    sourceURI: string;
    targetURI: string;
}

export function getEnvConfig(): EnvConfig {
    const {
        DELAY = "5m",
        SOURCE,
        TARGET
    } = process.env;
    return {
        delayMS: ms(DELAY),
        sourceURI: SOURCE,
        targetURI: TARGET
    };
}
