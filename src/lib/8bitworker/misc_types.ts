import {
    CodeListing,
    WorkerErrorResult,
    WorkerNextToolResult,
    WorkerOutputResult,
    WorkerUnchangedResult
} from "./misc_interfaces";

export type FileData = string | Uint8Array;

export type CodeListingMap = { [path: string]: CodeListing };

export type Segment = { name: string, start: number, size: number, last?: number, type?: string };

export type WorkerResult = WorkerErrorResult | WorkerOutputResult<any> | WorkerUnchangedResult;

export type FileEntry = {
    path: string
    encoding: string
    data: FileData
    ts: number
};

export type BuildStepResult = WorkerResult | WorkerNextToolResult;
