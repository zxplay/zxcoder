import {FileData, FileEntry, WorkingStore} from "./defs_files";

export class FileWorkingStore implements WorkingStore {
    workfs: { [path: string]: FileEntry } = {};
    workerseq: number = 0;
    items: {};

    constructor() {
        this.reset();
    }

    reset() {
        this.workfs = {};
        this.newVersion();
    }

    currentVersion() {
        return this.workerseq;
    }

    newVersion() {
        let ts = new Date().getTime();

        if (ts <= this.workerseq) {
            ts = ++this.workerseq;
        }

        return ts;
    }

    putFile(path: string, data: FileData): FileEntry {
        const encoding = (typeof data === 'string') ? 'utf8' : 'binary';
        let entry = this.workfs[path];

        if (!entry || !compareData(entry.data, data) || entry.encoding != encoding) {
            this.workfs[path] = entry = {
                path: path,
                data: data,
                encoding: encoding,
                ts: this.newVersion()
            };

            console.log('+++', entry.path, entry.encoding, entry.data.length, entry.ts);
        }

        return entry;
    }

    getFileData(path: string): FileData {
        return this.workfs[path] && this.workfs[path].data;
    }

    getFileAsString(path: string): string {
        let data = this.getFileData(path);

        if (data != null && typeof data !== 'string') {
            throw new Error(`${path}: expected string`)
        }

        return data as string;
    }

    setItem(key: string, value: object) {
        this.items[key] = value;
    }
}

function compareData(a: FileData, b: FileData): boolean {
    if (a.length != b.length) {
        return false;
    }

    if (typeof a === 'string' && typeof b === 'string') {
        return a == b;
    } else {
        for (let i = 0; i < a.length; i++) {
            if (a[i] != b[i]) return false;
        }

        return true;
    }
}
