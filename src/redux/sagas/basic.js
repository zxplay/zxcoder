import {takeLatest, select} from "redux-saga/effects";
import {actionTypes} from "../actions/basic";
import {store} from "../store";
import {loadTape} from "../actions/jsspeccy";
import zmakebas from "zmakebas";

// -----------------------------------------------------------------------------
// Action watchers
// -----------------------------------------------------------------------------

// noinspection JSUnusedGlobalSymbols
export function* watchForRunBasicActions() {
    yield takeLatest(actionTypes.runBasic, handleRunBasicActions);
}

// -----------------------------------------------------------------------------
// Action handlers
// -----------------------------------------------------------------------------

function* handleRunBasicActions(_) {
    const basic = yield select((state) => state.basic.basicCode);
    const tap = yield zmakebas(basic);
    yield store.dispatch(loadTape(tap));
}
