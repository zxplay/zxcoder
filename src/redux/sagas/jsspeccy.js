import {take, takeLatest, put, call, select} from "redux-saga/effects";
import {eventChannel} from "redux-saga";
import queryString from "query-string";
import {JSSpeccy} from "../../lib/emulator/JSSpeccy";
import {
    actionTypes,
    handleClick,
    reset,
    start
} from "../actions/jsspeccy";
import {reset as resetProject} from "../actions/project";
import {showActiveEmulator} from "../actions/app";

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
export function* watchForStartActions() {
    yield takeLatest(actionTypes.start, handleStartActions);
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
    yield put(showActiveEmulator());
    yield put(reset());
    yield put(start());
    jsspeccy.openTAPFile(action.tap.buffer);
}

function* handleLoadUrlActions(action) {
    yield put(resetProject());
    yield put(showActiveEmulator());
    yield put(reset());
    yield put(start());
    jsspeccy.openUrl(action.url);
    yield put(start()); // NOTE: Extra call to start was required here.
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

function* handleStartActions(_) {
    jsspeccy.start();
}

function* handleExitActions(_) {
    jsspeccy.exit();
}

function* handleOpenFileDialogActions(_) {
    yield put(resetProject());
    yield put(showActiveEmulator());
    jsspeccy.openFileDialog();
}

function* handleViewFullScreenActions(_) {
    jsspeccy.start();
    jsspeccy.enterFullscreen();
}

function* handleLocationChanges(action) {
    const path = action.payload.location.pathname;
    const match = typeof previousPath === 'undefined' || path === previousPath;

    if (!match || (path !== '/' && !path.startsWith('/projects/'))) {
        jsspeccy?.pause();
    }

    previousPath = path;
}

// -----------------------------------------------------------------------------
// Supporting code
// -----------------------------------------------------------------------------

let target = undefined;
let jsspeccy = undefined;
let previousPath = undefined;

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
