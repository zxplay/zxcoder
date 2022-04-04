import {WorkerMessage, WorkerResult} from "./defs_misc";
import {Builder} from "./Builder";
import {errorResult} from "./shared_funcs";
import {fsLoaded, loadFilesystem, fileStore} from "./files";

declare function postMessage(msg);

const TOOL_PRELOADFS = {
    'sdasz80': 'sdcc',
    'sdcc': 'sdcc',
}

const builder = new Builder();

async function handleMessage(data: WorkerMessage): Promise<WorkerResult> {

    // preload file system
    if (data.preload) {
        let fs = TOOL_PRELOADFS[data.preload];

        if (fs && !fsLoaded[fs]) {
            loadFilesystem(fs);
        }

        return;
    }

    // clear filesystem?
    if (data.reset) {
        fileStore.reset();
        return;
    }

    return builder.handleMessage(data);
}

let lastpromise = null;
onmessage = async function (e) {
    await lastpromise; // wait for previous message to complete
    lastpromise = handleMessage(e.data);
    const result = await lastpromise;
    lastpromise = null;
    if (result) {
        try {
            postMessage(result);
        } catch (e) {
            console.log(e);
            postMessage(errorResult(`${e}`));
        }
    }
}
