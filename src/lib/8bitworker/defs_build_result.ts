import {SourceFile} from "./SourceFile";

export interface SourceLocation {
    line: number
    label?: string
    path?: string
    start?: number
    end?: number
    segment?: string
    func?: string
}

export interface SourceSnippet extends SourceLocation {
    offset: number
    insns?: string
    iscode?: boolean
    cycles?: number
}

export interface CodeListing {
    lines: SourceSnippet[]
    asmlines?: SourceSnippet[]
    text?: string
    sourcefile?: SourceFile // not returned by worker
    assemblyfile?: SourceFile // not returned by worker
}

export type CodeListingMap = { [path: string]: CodeListing };

export type Segment = { name: string, start: number, size: number, last?: number, type?: string };

export interface WorkerOutputResult<T> {
    output: T
    listings?: CodeListingMap
    symbolmap?: { [sym: string]: number }
    params?: {}
    segments?: Segment[]
    debuginfo?: {} // optional info
}

export interface WorkerUnchangedResult {
    unchanged: true
}

export type WorkerResult = WorkerErrorResult | WorkerOutputResult<any> | WorkerUnchangedResult;

export interface WorkerNextToolResult {
    nexttool?: string
    linktool?: string
    path?: string
    args: string[]
    files: string[]
}

export type BuildStepResult = WorkerResult | WorkerNextToolResult;

export interface WorkerError extends SourceLocation {
    msg: string
}

export interface WorkerErrorResult {
    errors: WorkerError[]
}
