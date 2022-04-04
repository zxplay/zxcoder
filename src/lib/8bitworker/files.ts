import {WORKER_RELATIVE_PATH} from "./shared_vars";
import {FileWorkingStore} from "./FileWorkingStore";
import {FileData, FileEntry} from "./defs_files";
import {BuildStep} from "./defs_build";

const fsMeta = {};
const fsBlob = {};
export var fileStore = new FileWorkingStore();

export function loadFilesystem(name: string) {
    let xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.open("GET", WORKER_RELATIVE_PATH + "fs/fs" + name + ".data", false);  // synchronous request
    xhr.send(null);
    fsBlob[name] = xhr.response;

    xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open("GET", WORKER_RELATIVE_PATH + "fs/fs" + name + ".js.metadata", false);  // synchronous request
    xhr.send(null);
    fsMeta[name] = xhr.response;

    console.log("Loaded " + name + " filesystem", fsMeta[name].files.length, 'files', fsBlob[name].size, 'bytes');
}

export function fsLoaded(name: string) {
    return fsMeta.hasOwnProperty(name);
}

// mount the filesystem at /share
export function setupFS(FS, name: string) {
    const WORKERFS = FS.filesystems['WORKERFS'];

    if (!fsMeta[name]) {
        throw Error("No filesystem for '" + name + "'");
    }

    FS.mkdir('/share');
    FS.mount(WORKERFS, {
        packages: [{metadata: fsMeta[name], blob: fsBlob[name]}]
    }, '/share');

    // fix for slow Blob operations by caching typed arrays
    // https://github.com/kripken/emscripten/blob/incoming/src/library_workerfs.js
    // https://bugs.chromium.org/p/chromium/issues/detail?id=349304#c30

    const reader = WORKERFS.reader;
    const blobcache = {};

    WORKERFS.stream_ops.read = function (stream, buffer, offset, length, position) {
        if (position >= stream.node.size) {
            return 0;
        }

        let contents = blobcache[stream.path];
        if (!contents) {
            // noinspection JSVoidFunctionReturnValueUsed
            const ab = reader.readAsArrayBuffer(stream.node.contents);
            contents = blobcache[stream.path] = new Uint8Array(ab);
        }

        if (position + length > contents.length) {
            length = contents.length - position;
        }

        for (let i = 0; i < length; i++) {
            buffer[offset + i] = contents[position + i];
        }

        return length;
    };
}

export function putWorkFile(path: string, data: FileData) {
    return fileStore.putFile(path, data);
}

export function getWorkFileAsString(path: string): string {
    return fileStore.getFileAsString(path);
}

function populateEntry(fs, path: string, entry: FileEntry) {
    let data = entry.data;

    // create subfolders
    const toks = path.split('/');
    if (toks.length > 1) {
        for (let i = 0; i < toks.length - 1; i++) {
            try {
                fs.mkdir(toks[i]);
            } catch (e) {
                console.log(e);
            }
        }
    }

    // write file
    fs.writeFile(path, data, {encoding: entry.encoding});
    const time = new Date(entry.ts).getTime();
    fs.utime(path, time, time);
    console.log("<<<", path, entry.data.length);
}

// can call multiple times (from populateFiles)
export function gatherFiles(step: BuildStep): number {
    let maxts = 0;
    if (step.files) {
        for (let i = 0; i < step.files.length; i++) {
            const path = step.files[i];
            const entry = fileStore.workfs[path];

            if (!entry) {
                throw new Error("No entry for path '" + path + "'");
            } else {
                maxts = Math.max(maxts, entry.ts);
            }
        }
    } else if (step.path) {
        const path = step.path;
        const entry = fileStore.workfs[path];
        maxts = entry.ts;
        step.files = [path];
    }

    if (step.path && !step.prefix) {
        step.prefix = getPrefix(step.path);
    }

    step.maxts = maxts;
    return maxts;
}

function getPrefix(s: string): string {
    const pos = s.lastIndexOf('.');
    return (pos > 0) ? s.substring(0, pos) : s;
}

export function populateFiles(step: BuildStep, fs) {
    gatherFiles(step);

    if (!step.files) {
        throw Error("call gatherFiles() first");
    }

    for (let i = 0; i < step.files.length; i++) {
        const path = step.files[i];
        populateEntry(fs, path, fileStore.workfs[path]);
    }
}

export function populateExtraFiles(step: BuildStep, fs, extrafiles) {
    if (extrafiles) {
        for (let i = 0; i < extrafiles.length; i++) {
            const xfn = extrafiles[i];

            // is this file cached?
            if (fileStore.workfs[xfn]) {
                fs.writeFile(xfn, fileStore.workfs[xfn].data, {encoding: 'binary'});
                continue;
            }

            // fetch from network
            const xpath = "zx/" + xfn;
            const xhr = new XMLHttpRequest();
            xhr.responseType = 'arraybuffer';
            xhr.open("GET", WORKER_RELATIVE_PATH + xpath, false);  // synchronous request
            xhr.send(null);

            if (xhr.response && xhr.status == 200) {
                const data = new Uint8Array(xhr.response);
                fs.writeFile(xfn, data, {encoding: 'binary'});
                putWorkFile(xfn, data);
                console.log(":::", xfn, data.length);
            } else {
                throw Error("Could not load extra file " + xpath);
            }
        }
    }
}

export function staleFiles(step: BuildStep, targets: string[]) {
    if (!step.maxts) {
        throw Error("call populateFiles() first");
    }

    // see if any target files are more recent than inputs
    for (let i = 0; i < targets.length; i++) {
        const entry = fileStore.workfs[targets[i]];
        if (!entry || step.maxts > entry.ts) {
            return true;
        }
    }

    console.log("unchanged", step.maxts, targets);
    return false;
}

export function anyTargetChanged(step: BuildStep, targets: string[]) {
    if (!step.maxts) {
        throw Error("call populateFiles() first");
    }

    // see if any target files are more recent than inputs
    for (let i = 0; i < targets.length; i++) {
        const entry = fileStore.workfs[targets[i]];
        if (!entry || entry.ts > step.maxts) {
            return true;
        }
    }

    console.log("unchanged", step.maxts, targets);
    return false;
}
