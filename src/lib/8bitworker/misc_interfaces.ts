import {BuildStepResult, CodeListingMap, FileData, Segment} from "./misc_types";
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

export interface Dependency {
    path: string
    filename: string
    link: boolean
    data: FileData
}

export interface WorkerFileUpdate {
    path: string
    data: FileData
}

export interface WorkerBuildStep {
    path?: string
    files?: string[]
    tool?: string
    mainfile?: boolean
}

export interface PlatformParams {
    arch: string
    code_start: number
    rom_size: number
    data_start: number
    data_size: number
    stack_end: number
    extra_link_args: string[]
    extra_link_files: string[]
}

export interface BuildStep extends WorkerBuildStep {
    args?: string[]
    params?: PlatformParams
    result?: BuildStepResult
    prefix?: string
    maxts?: number
}

export interface WorkerItemUpdate {
    key: string
    value: object
}

export interface WorkerMessage {
    preload?: string
    updates: WorkerFileUpdate[]
    buildsteps: WorkerBuildStep[]
    reset?: boolean
    code?: string
    setitems?: WorkerItemUpdate[]
}

export interface WorkerError extends SourceLocation {
    msg: string
}

export interface CodeListing {
    lines: SourceSnippet[]
    asmlines?: SourceSnippet[]
    text?: string
    sourcefile?: SourceFile // not returned by worker
    assemblyfile?: SourceFile // not returned by worker
}

export interface WorkerUnchangedResult {
    unchanged: true
}

export interface WorkerErrorResult {
    errors: WorkerError[]
}

export interface WorkerOutputResult<T> {
    output: T
    listings?: CodeListingMap
    symbolmap?: { [sym: string]: number }
    params?: {}
    segments?: Segment[]
    debuginfo?: {} // optional info
}

export interface WorkingStore {
    getFileData(path: string): FileData
}

/// <reference types="emscripten" />
export interface EmscriptenModule {
    callMain?: (args: string[]) => void
    FS: any
}

export interface WorkerNextToolResult {
    nexttool?: string
    linktool?: string
    path?: string
    args: string[]
    files: string[]
}
