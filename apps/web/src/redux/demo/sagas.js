import {takeLatest, select, put, call} from "redux-saga/effects";
import getZmakebasTap from "zmakebas";
import getPasmoTap from "pasmo";
import {actionTypes, setSelectedTabIndex} from "./actions";
import {loadTap, pause} from "../jsspeccy/actions";
import {setErrorItems} from "../project/actions";
import {handleException} from "../../errors";

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
            yield put(loadTap(tap));
            yield put(setSelectedTabIndex(0));
        } catch (errorItems) {
            yield put(setErrorItems(errorItems));
        }
    } catch (e) {
        handleException(e);
    }
}

function* handleRunSinclairBasicActions(_) {
    try {
        const code = yield select((state) => state.demo.sinclairBasicCode);
        try {
            const tap = yield call(getZmakebasTap, code);
            yield put(loadTap(tap));
            yield put(setSelectedTabIndex(0));
        } catch (errorItems) {
            yield put(setErrorItems(errorItems));
        }
    } catch (e) {
        handleException(e);
    }
}
