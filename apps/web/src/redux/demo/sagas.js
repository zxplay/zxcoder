import {takeLatest, select, put, call} from "redux-saga/effects";
import getZmakebasTap from "zmakebas";
import getPasmoTap from "pasmo";
import {actionTypes} from "./actions";
import {store} from "../store";
import {loadTap, pause} from "../jsspeccy/actions";
import {handleWasmErrorItems} from "../../errors";

// -----------------------------------------------------------------------------
// Action watchers
// -----------------------------------------------------------------------------

// noinspection JSUnusedGlobalSymbols
export function* watchForSetSelectedTabIndexActions() {
    yield takeLatest(actionTypes.setSelectedTabIndex, handleSetSelectedTabIndexActions);
}

// noinspection JSUnusedGlobalSymbols
export function* watchForRunAssemblyActions() {
    yield takeLatest(actionTypes.runAssembly, handleRunAssemblyActions);
}

// noinspection JSUnusedGlobalSymbols
export function* watchForRunSinclairBasicActions() {
    yield takeLatest(actionTypes.runSinclairBasic, handleRunSinclairBasicActions);
}

// -----------------------------------------------------------------------------
// Action handlers
// -----------------------------------------------------------------------------

function* handleSetSelectedTabIndexActions(_) {
    yield put(pause())
}

function* handleRunAssemblyActions(_) {
    try {
        const code = yield select((state) => state.demo.asmCode);
        try {
            const tap = yield call(getPasmoTap, code);
            store.dispatch(loadTap(tap));
        } catch (errorItems) {
            handleWasmErrorItems(errorItems);
        }
    } catch (e) {
        console.error(e);
    }
}

function* handleRunSinclairBasicActions(_) {
    try {
        const code = yield select((state) => state.demo.sinclairBasicCode);
        try {
            const tap = yield call(getZmakebasTap, code);
            store.dispatch(loadTap(tap));
        } catch (errorItems) {
            handleWasmErrorItems(errorItems);
        }
    } catch (e) {
        console.error(e);
    }
}
