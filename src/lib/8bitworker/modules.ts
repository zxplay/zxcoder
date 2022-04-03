import {WORKER_RELATIVE_PATH} from "./shared_vars";

declare function importScripts(path: string);

const wasmModuleCache = {};
const wasmBlob = {};
const loaded = {};

function getWASMModule(module_id: string) {
    let module = wasmModuleCache[module_id];

    if (!module) {
        module = new WebAssembly.Module(wasmBlob[module_id]);
        wasmModuleCache[module_id] = module;
        delete wasmBlob[module_id];
    }

    return module;
}

export function instantiateWASM(module_id: string) {
    return function (imports, ri) {
        const mod = getWASMModule(module_id);
        const inst = new WebAssembly.Instance(mod, imports);
        ri(inst);
        return inst.exports;
    }
}

export function loadWASM(modulename: string, debug?: boolean) {
    if (!loaded[modulename]) {
        importScripts(WORKER_RELATIVE_PATH + "wasm/" + modulename + (debug ? "." + debug + ".js" : ".js"));

        const xhr = new XMLHttpRequest();
        xhr.responseType = 'arraybuffer';
        xhr.open("GET", WORKER_RELATIVE_PATH + "wasm/" + modulename + ".wasm", false);  // synchronous request
        xhr.send(null);

        if (xhr.response) {
            wasmBlob[modulename] = new Uint8Array(xhr.response);
            console.log("Loaded " + modulename + ".wasm (" + wasmBlob[modulename].length + " bytes)");
            loaded[modulename] = 1;
        } else {
            throw Error("Could not load WASM file " + modulename + ".wasm");
        }
    }
}

export function loadASMJS(modulename: string, debug?: boolean) {
    if (!loaded[modulename]) {
        importScripts(WORKER_RELATIVE_PATH + 'asmjs/' + modulename + (debug ? "." + debug + ".js" : ".js"));
        loaded[modulename] = 1;
    }
}
