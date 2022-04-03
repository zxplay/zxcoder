import {SourceSnippet} from "./misc_interfaces";

const re_crlf = /\r?\n/;
const re_lineoffset = /\s*(\d+)\s+[%]line\s+(\d+)\+(\d+)\s+(.+)/;

export function parseListing(code: string,
                             lineMatch,
                             iline: number,
                             ioffset: number,
                             iinsns: number,
                             icycles?: number,
                             funcMatch?, segMatch?): SourceSnippet[] {

    const lines: SourceSnippet[] = [];

    let lineofs = 0;
    let segment = '';
    let func = '';
    let funcbase = 0;

    code.split(re_crlf).forEach((line, lineindex) => {
        let segm = segMatch && segMatch.exec(line);
        if (segm) {
            segment = segm[1];
        }

        let funcm = funcMatch && funcMatch.exec(line);
        if (funcm) {
            funcbase = parseInt(funcm[1], 16);
            func = funcm[2];
        }

        const linem = lineMatch.exec(line);
        if (linem && linem[1]) {
            const linenum = iline < 0 ? lineindex : parseInt(linem[iline]);
            const offset = parseInt(linem[ioffset], 16);
            const insns = linem[iinsns];
            const cycles: number = icycles ? parseInt(linem[icycles]) : null;
            const iscode = cycles > 0;

            if (insns) {
                lines.push({
                    line: linenum + lineofs,
                    offset: offset - funcbase,
                    insns,
                    cycles,
                    iscode,
                    segment,
                    func
                });
            }
        } else {
            let m = re_lineoffset.exec(line);
            if (m) {
                lineofs = parseInt(m[2]) - parseInt(m[1]) - parseInt(m[3]);
            }
        }
    });

    return lines;
}

export function parseSourceLines(code: string, lineMatch, offsetMatch, funcMatch?, segMatch?) {
    const lines = [];

    let lastlinenum = 0;
    let segment = '';
    let func = '';
    let funcbase = 0;

    for (let line of code.split(re_crlf)) {
        let segm = segMatch && segMatch.exec(line);
        if (segm) {
            segment = segm[1];
        }

        let funcm = funcMatch && funcMatch.exec(line);
        if (funcm) {
            funcbase = parseInt(funcm[1], 16);
            func = funcm[2];
        }

        let linem = lineMatch.exec(line);
        if (linem && linem[1]) {
            lastlinenum = parseInt(linem[1]);
        } else if (lastlinenum) {
            linem = offsetMatch.exec(line);
            if (linem && linem[1]) {
                const offset = parseInt(linem[1], 16);

                lines.push({
                    line: lastlinenum,
                    offset: offset - funcbase,
                    segment,
                    func
                });

                lastlinenum = 0;
            }
        }
    }

    return lines;
}
