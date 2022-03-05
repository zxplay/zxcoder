import {select, takeLatest, put} from "redux-saga/effects";
import {actionTypes} from "../actions/app";
import {setSelectedTabIndex as setDemoTabIndex} from "../actions/demo";
import {setSelectedTabIndex} from "../actions/project";

// -----------------------------------------------------------------------------
// Action watchers
// -----------------------------------------------------------------------------

// noinspection JSUnusedGlobalSymbols
export function* watchForShowActiveEmulatorActions() {
    yield takeLatest(actionTypes.showActiveEmulator, handleShowActiveEmulatorActions);
}

// -----------------------------------------------------------------------------
// Action handlers
// -----------------------------------------------------------------------------

function* handleShowActiveEmulatorActions(action) {
    const project = yield select((state) => state.project.id);
    const isProject = typeof project !== 'undefined';

    if (isProject) {
        yield put(setSelectedTabIndex(1));
    } else {
        yield put(setDemoTabIndex(0));
    }
}
