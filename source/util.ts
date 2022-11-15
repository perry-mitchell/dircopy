import { Stream } from "node:stream";
import endOfStream from "end-of-stream";

export async function waitForStreamEnd(stream: Stream): Promise<void> {
    return new Promise((resolve, reject) => {
        endOfStream(stream, (err: Error | null) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}
