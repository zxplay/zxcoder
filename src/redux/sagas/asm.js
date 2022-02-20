import {takeLatest, select} from "redux-saga/effects";
import {actionTypes} from "../actions/asm";
import {store} from "../store";
import {loadTape} from "../actions/jsspeccy";
import pasmo from "pasmo";

// -----------------------------------------------------------------------------
// Action watchers
// -----------------------------------------------------------------------------

// noinspection JSUnusedGlobalSymbols
export function* watchForRunAssemblyActions() {
    yield takeLatest(actionTypes.runAssembly, handleRunAssemblyActions);
}

// -----------------------------------------------------------------------------
// Action handlers
// -----------------------------------------------------------------------------

function* handleRunAssemblyActions(_) {
    const asm = yield select((state) => state.asm.asmCode);
    const tap = yield pasmo(asm);
    yield store.dispatch(loadTape(tap));
}
