import {take, takeLatest, put, call} from "redux-saga/effects";
import {eventChannel} from "redux-saga";
import {push} from "connected-react-router";
import queryString from "query-string";
import {JSSpeccy} from "../../lib/emulator/JSSpeccy";
import {actionTypes, handleClick} from "../actions/jsspeccy";
import {reset as resetProject} from "../actions/project";
import {setSelectedTabIndex} from "../actions/demo";

// -----------------------------------------------------------------------------
// Action watchers
// -----------------------------------------------------------------------------

// noinspection JSUnusedGlobalSymbols
export function* watchForRenderEmulatorActions() {
    yield takeLatest(actionTypes.renderEmulator, handleRenderEmulatorActions);
}

// noinspection JSUnusedGlobalSymbols
export function* watchForLoadEmulatorActions() {
    yield takeLatest(actionTypes.loadEmulator, handleLoadEmulatorActions);
}

// noinspection JSUnusedGlobalSymbols
export function* watchForLoadTapeActions() {
    yield takeLatest(actionTypes.loadTape, handleLoadTapeActions);
}

// noinspection JSUnusedGlobalSymbols
export function* watchForLoadUrlActions() {
    yield takeLatest(actionTypes.loadUrl, handleLoadUrlActions);
}

// noinspection JSUnusedGlobalSymbols
export function* watchForClickEvents() {
    const chan = yield call(getClickEventChannel);
    try {
        while (true) {
            const e = yield take(chan);
            yield put(handleClick(e));
        }
    } finally {
        chan.close();
    }
}

// noinspection JSUnusedGlobalSymbols
export function* watchForHandleClickActions() {
    yield takeLatest(actionTypes.handleClick, handleClickActions);
}

// noinspection JSUnusedGlobalSymbols
export function* watchForResetActions() {
    yield takeLatest(actionTypes.reset, handleResetActions);
}

// noinspection JSUnusedGlobalSymbols
export function* watchForPauseActions() {
    yield takeLatest(actionTypes.pause, handlePauseActions);
}

// noinspection JSUnusedGlobalSymbols
export function* watchForExitActions() {
    yield takeLatest(actionTypes.exit, handleExitActions);
}

// noinspection JSUnusedGlobalSymbols
export function* watchForOpenFileDialogActions() {
    yield takeLatest(actionTypes.showOpenFileDialog, handleOpenFileDialogActions);
}

// noinspection JSUnusedGlobalSymbols
export function* watchForViewFullScreenActions() {
    yield takeLatest(actionTypes.viewFullScreen, handleViewFullScreenActions);
}

// noinspection JSUnusedGlobalSymbols
export function* watchForLocationChanges() {
    yield takeLatest('@@router/LOCATION_CHANGE', handleLocationChanges);
}

// -----------------------------------------------------------------------------
// Action handlers
// -----------------------------------------------------------------------------

function* handleRenderEmulatorActions(action) {
    const zoom = action.zoom || 2;
    const width = zoom * 320;

    console.assert(target === undefined);
    target = document.createElement('div');
    target.style.width = `${width}px`;
    target.style.margin = '0px';
    target.style.backgroundColor = '#fff';

    const emuParams = {
        zoom,
        sandbox: false,
        autoLoadTapes: true,
    };

    let doFilter = false;

    const parsed = queryString.parse(location.search);

    if (parsed.m && (parsed.m === '48' || parsed.m === '128' || parsed.m === '5')) {
        emuParams.machine = parsed.m;
    }

    if (parsed.u) {
        emuParams.openUrl = parsed.u;
    }

    if (parsed.f && parsed.f !== '0') {
        doFilter = true;
    }

    console.assert(jsspeccy === undefined);
    jsspeccy = JSSpeccy(target, emuParams);
    jsspeccy.hideUI();

    if (doFilter) {
        // TODO: Investigate this option, and narrow the element selector.
        document.getElementsByTagName('canvas')[0].style.imageRendering = "auto";
    }
}

function* handleLoadEmulatorActions(action) {
    console.assert(action.target, 'no action target to append fragment to');
    console.assert(target, 'no target to append to fragment');
    const fragment = document.createDocumentFragment();
    fragment.appendChild(target);
    action.target.appendChild(fragment);
}

function* handleLoadTapeActions(action) {
    yield put(push('/'));
    jsspeccy.reset();
    jsspeccy.start();
    jsspeccy.openTAPFile(action.tap.buffer);
}

function* handleLoadUrlActions(action) {
    yield put(resetProject());
    yield put(setSelectedTabIndex(0));
    yield put(push('/'));
    jsspeccy.reset();
    jsspeccy.openUrl(action.url);
    jsspeccy.start();
}

function* handleClickActions(action) {
    const target = action.e.target;

    // Pause emulator if clicking on a text input.
    if (target instanceof Element) {
        if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
            jsspeccy.pause();
            return;
        }
    }

    // Pause emulator if clicking on CodeMirror instance.
    const elems = document.getElementsByClassName('CodeMirror');
    for (let i = 0; i < elems.length; ++i) {
        let elem = elems[i];
        if (elem.contains(target)) {
            jsspeccy.pause();
            return;
        }
    }
}

function* handleResetActions(_) {
    jsspeccy.reset();
    jsspeccy.start();
}

function* handlePauseActions(_) {
    jsspeccy.pause();
}

function* handleExitActions(_) {
    jsspeccy.exit();
}

function* handleOpenFileDialogActions(_) {
    yield put(resetProject());
    yield put(setSelectedTabIndex(0));
    jsspeccy.openFileDialog();
}

function* handleViewFullScreenActions(_) {
    jsspeccy.start();
    jsspeccy.enterFullscreen();
}

function* handleLocationChanges(action) {
    const path = action.payload.location.pathname;
    if (path !== '/') jsspeccy?.pause();
}

// -----------------------------------------------------------------------------
// Supporting code
// -----------------------------------------------------------------------------

let target = undefined;
let jsspeccy = undefined;

function getClickEventChannel() {
    return eventChannel(emit => {
        const emitter = (e) => emit(e);
        window.addEventListener('click', emitter);
        return () => {
            // Must return an unsubscribe function.
            window.removeEventListener('click', emitter);
        }
    })
}
