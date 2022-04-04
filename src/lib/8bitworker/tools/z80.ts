import {BuildStepResult, CodeListingMap} from "../defs_types";
import {
    anyTargetChanged,
    gatherFiles,
    populateFiles,
    putWorkFile,
    staleFiles
} from "../files";
import {BuildStep, EmscriptenModule} from "../defs_interfaces";
import {emglobal} from "../shared_vars";
import {loadWASM, instantiateWASM} from "../modules";
import {parseListing} from "../parsing";
import {print_fn, makeErrorMatcher} from "../shared_funcs";

export function assembleZMAC(step: BuildStep): BuildStepResult {
    loadWASM("zmac");

    let lstout, binout;
    const errors = [];

    gatherFiles(step);

    const lstpath = step.prefix + ".lst";
    const binpath = step.prefix + ".cim";

    if (staleFiles(step, [binpath, lstpath])) {
        const ZMAC: EmscriptenModule = emglobal.zmac({
            instantiateWasm: instantiateWASM('zmac'),
            noInitialRun: true,
            //logReadFiles:true,
            print: print_fn,
            printErr: makeErrorMatcher(errors, /([^( ]+)\s*[(](\d+)[)]\s*:\s*(.+)/, 2, 3, step.path),
        });

        const FS = ZMAC.FS;
        populateFiles(step, FS);
        ZMAC.callMain(['-z', '-c', '--oo', 'lst,cim', step.path]);

        if (errors.length) {
            return {errors: errors};
        }

        lstout = FS.readFile("zout/" + lstpath, {encoding: 'utf8'});
        binout = FS.readFile("zout/" + binpath, {encoding: 'binary'});

        putWorkFile(binpath, binout);
        putWorkFile(lstpath, lstout);

        if (!anyTargetChanged(step, [binpath, lstpath])) {
            return;
        }

        //  230: 1739+7+x   017A  1600      L017A: LD      D,00h
        const lines = parseListing(lstout, /\s*(\d+):\s*([0-9a-f]+)\s+([0-9a-f]+)\s+(.+)/i, 1, 2, 3);
        const listings: CodeListingMap = {};
        listings[lstpath] = {lines: lines};

        // parse symbol table
        const symbolmap = {};
        const sympos = lstout.indexOf('Symbol Table:');
        if (sympos > 0) {
            const symout = lstout.slice(sympos + 14);
            symout.split('\n').forEach(function (l) {
                const m = l.match(/(\S+)\s+([= ]*)([0-9a-f]+)/i);
                if (m) {
                    symbolmap[m[1]] = parseInt(m[3], 16);
                }
            });
        }

        return {
            output: binout,
            listings: listings,
            errors: errors,
            symbolmap: symbolmap
        };
    }
}
