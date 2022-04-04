import {SourceSnippet} from "./defs_misc";

export class SourceFile {

    lines: SourceSnippet[];
    text: string;
    offset2loc: Map<number, SourceSnippet>; //{[offset:number]:number};
    line2offset: Map<number, number>; //{[line:number]:number};

    constructor(lines: SourceSnippet[], text: string) {
        lines = lines || [];

        this.lines = lines;
        this.text = text;
        this.offset2loc = new Map();
        this.line2offset = new Map();

        for (let info of lines) {
            if (info.offset >= 0) {

                // first line wins (is assigned to offset)
                if (!this.offset2loc[info.offset]) {
                    this.offset2loc[info.offset] = info;
                }

                if (!this.line2offset[info.line]) {
                    this.line2offset[info.line] = info.offset;
                }
            }
        }
    }

    findLineForOffset(PC: number, lookbehind: number) {
        if (this.offset2loc) {
            for (let i = 0; i <= lookbehind; i++) {
                const loc = this.offset2loc[PC];

                if (loc) {
                    return loc;
                }

                PC--;
            }
        }

        return null;
    }

    lineCount(): number {
        return this.lines.length;
    }
}
