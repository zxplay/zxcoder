import {BuildStepResult} from "./defs_build_result";
import {FileData} from "./defs_files";

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

export interface WorkerBuildStep {
    path?: string
    files?: string[]
    tool?: string
    mainfile?: boolean
}

export interface BuildStep extends WorkerBuildStep {
    args?: string[]
    params?: PlatformParams
    result?: BuildStepResult
    prefix?: string
    maxts?: number
}

export interface WorkerFileUpdate {
    path: string
    data: FileData
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
    setitems?: WorkerItemUpdate[]
}
