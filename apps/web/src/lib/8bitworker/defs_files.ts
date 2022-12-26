export type FileData = string | Uint8Array;

export type FileEntry = {
    path: string
    encoding: string
    data: FileData
    ts: number
};

export interface WorkingStore {
    getFileData(path: string): FileData
}
