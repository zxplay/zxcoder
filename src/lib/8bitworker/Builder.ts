import {
    BuildStep,
    PlatformParams,
    WorkerError,
    WorkerMessage
} from "./defs_interfaces";
import {WorkerResult} from "./defs_types";
import {fileStore} from "./files";
import {errorResult} from "./shared_funcs";
import * as sdcc from "./tools/sdcc";
import * as z80 from "./tools/z80";

const TOOLS = {
    'sdasz80': sdcc.assembleSDASZ80,
    'sdldz80': sdcc.linkSDLDZ80,
    'sdcc': sdcc.compileSDCC,
    'zmac': z80.assembleZMAC,
};

const PLATFORM_PARAMS = {
    arch: 'z80',
    code_start: 0x5ccb,
    rom_size: 0xff58 - 0x5ccb,
    data_start: 0xf000,
    data_size: 0xfe00 - 0xf000,
    stack_end: 0xff58,
    extra_link_args: ['crt0.rel'],
    extra_link_files: ['crt0.rel', 'crt0.lst']
} as PlatformParams;

export class Builder {
    steps: BuildStep[] = [];
    startseq: number = 0;

    async executeBuildSteps(): Promise<WorkerResult> {
        this.startseq = fileStore.currentVersion();

        let linkstep: BuildStep = null;

        while (this.steps.length) {
            const step = this.steps.shift(); // get top of array
            const toolfn = TOOLS[step.tool];

            if (!toolfn) {
                throw Error("no tool named " + step.tool);
            }

            step.params = PLATFORM_PARAMS;

            try {
                step.result = await toolfn(step);
            } catch (e) {
                console.log("EXCEPTION", e, e.stack);
                return errorResult(`${e}`);
            }

            if (step.result) {
                (step.result as any).params = step.params;

                // errors? return them
                if ('errors' in step.result && step.result.errors.length) {
                    applyDefaultErrorPath(step.result.errors, step.path);
                    return step.result;
                }

                // if we got some output, return it immediately
                if ('output' in step.result && step.result.output) {
                    return step.result;
                }

                // combine files with a link tool?
                if ('linktool' in step.result) {
                    if (linkstep) {
                        linkstep.files = linkstep.files.concat(step.result.files);
                        linkstep.args = linkstep.args.concat(step.result.args);
                    } else {
                        linkstep = {
                            tool: step.result.linktool,
                            files: step.result.files,
                            args: step.result.args
                        };
                    }
                }

                // process with another tool?
                if ('nexttool' in step.result) {
                    const asmstep: BuildStep = {
                        tool: step.result.nexttool,
                        ...step.result
                    }

                    this.steps.push(asmstep);
                }

                // process final step?
                if (this.steps.length == 0 && linkstep) {
                    this.steps.push(linkstep);
                    linkstep = null;
                }
            }
        }
    }

    async handleMessage(data: WorkerMessage): Promise<WorkerResult> {
        this.steps = [];

        // file updates
        if (data.updates) {
            data.updates.forEach((u) => fileStore.putFile(u.path, u.data));
        }

        // object update
        if (data.setitems) {
            data.setitems.forEach((i) => fileStore.setItem(i.key, i.value));
        }

        // build steps
        if (data.buildsteps) {
            this.steps.push.apply(this.steps, data.buildsteps);
        }

        // single-file
        if (data.code) {
            this.steps.push(data as BuildStep);
        }

        // execute build steps
        if (this.steps.length) {
            const result = await this.executeBuildSteps();
            return result ? result : {unchanged: true};
        }

        // message not recognized
        console.log("Unknown message", data);
    }
}

function applyDefaultErrorPath(errors: WorkerError[], path: string) {
    if (!path) {
        return;
    }

    for (let i = 0; i < errors.length; i++) {
        const err = errors[i];
        if (!err.path && err.line) {
            err.path = path;
        }
    }
}
