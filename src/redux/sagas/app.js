import {select, takeLatest, put} from "redux-saga/effects";
import {push} from "connected-react-router";
import {actionTypes} from "../actions/app";
import {setSelectedTabIndex as setDemoTabIndex} from "../actions/demo";
import {setSelectedTabIndex} from "../actions/project";
import {reset} from "../actions/jsspeccy";

// -----------------------------------------------------------------------------
// Action watchers
// -----------------------------------------------------------------------------

// noinspection JSUnusedGlobalSymbols
export function* watchForShowActiveEmulatorActions() {
    yield takeLatest(actionTypes.showActiveEmulator, handleShowActiveEmulatorActions);
}

// noinspection JSUnusedGlobalSymbols
export function* watchForResetEmulatorActions() {
    yield takeLatest(actionTypes.resetEmulator, handleResetEmulatorActions);
}

// -----------------------------------------------------------------------------
// Action handlers
// -----------------------------------------------------------------------------

function* handleShowActiveEmulatorActions(_) {
    const projectId = yield select((state) => state.project.id);
    const isProject = typeof projectId !== 'undefined';

    if (isProject) {
        yield put(setSelectedTabIndex(1));
        yield put(push(`/projects/${projectId}`));
    } else {
        yield put(setDemoTabIndex(0));
        yield put(push('/'));
    }
}

function* handleResetEmulatorActions(_) {
    const projectId = yield select((state) => state.project.id);
    const isProject = typeof projectId !== 'undefined';

    if (isProject) {
        yield put(setSelectedTabIndex(1));
        yield put(push(`/projects/${projectId}`));
        yield put(reset());
    } else {
        yield put(setDemoTabIndex(0));
        yield put(push('/'));
        yield put(reset());
    }
}
