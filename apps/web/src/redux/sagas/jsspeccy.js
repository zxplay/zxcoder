import {take, takeLatest, put, call} from "redux-saga/effects";
import {eventChannel} from "redux-saga";
import queryString from "query-string";
import {JSSpeccy} from "../../lib/jsspeccy/JSSpeccy";
import {
    actionTypes,
    handleClick,
    reset,
    start
} from "../jsspeccy/jsspeccy";
import {reset as resetProject} from "../project/project";
import {showActiveEmulator} from "../app/app";

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
export function* watchForLoadTapActions() {
    yield takeLatest(actionTypes.loadTap, handleLoadTapActions);
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
    try {
        const zoom = action.zoom || 2;
        const width = zoom * 320;

        console.assert(target === undefined);
        target = document.createElement('div');
        target.style.width = `${width}px`;
        target.style.margin = '0px';
        target.style.backgroundColor = '#fff';

        const emuParams = {
            zoom,
            machine: 48, // or 128
            autoLoadTapes: true,
            tapeAutoLoadMode: 'default' // or usr0
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

        if (parsed.a && parsed.a === '0') {
            emuParams.autoLoadTapes = false;
        }

        console.assert(jsspeccy === undefined);
        jsspeccy = JSSpeccy(target, emuParams);
        jsspeccy.hideUI();

        if (doFilter) {
            // TODO: Investigate this option, and narrow the element selector.
            document.getElementsByTagName('canvas')[0].style.imageRendering = "auto";
        }
    } catch (e) {
        console.error(e);
    }
}

function* handleLoadEmulatorActions(action) {
    try {
        console.assert(action.target, 'no action target to append fragment to');
        console.assert(target, 'no target to append to fragment');
        const fragment = document.createDocumentFragment();
        fragment.appendChild(target);
        action.target.appendChild(fragment);
    } catch (e) {
        console.error(e);
    }
}

function* handleLoadTapActions(action) {
    try {
        yield put(showActiveEmulator());
        yield put(reset());
        yield put(start());
        jsspeccy.openTAPFile(action.tap.buffer);
    } catch (e) {
        console.error(e);
    }
}

function* handleLoadUrlActions(action) {
    try {
        yield put(resetProject());
        yield put(showActiveEmulator());
        yield put(reset());
        yield put(start());
        jsspeccy.openUrl(action.url);
        yield put(start()); // NOTE: Extra call to start was required here.
    } catch (e) {
        console.error(e);
    }
}

function* handleClickActions(action) {
    try {
        const target = action.e.target;

        const screenElem = document.getElementById('jsspeccy-screen');
        if (screenElem?.contains(target)) {
            return;
        }

        const keysElem = document.getElementById('virtkeys');
        if (keysElem?.contains(target)) {
            return;
        }

        // Clicks anywhere except screen or keys to pause emulator.
        jsspeccy.pause();
    } catch (e) {
        console.error(e);
    }
}

function* handleResetActions(_) {
    try {
        jsspeccy.reset();
        setTimeout(() => jsspeccy.start(), 1);
    } catch (e) {
        console.error(e);
    }
}

function* handlePauseActions(_) {
    try {
        jsspeccy.pause();
    } catch (e) {
        console.error(e);
    }
}

function* handleStartActions(_) {
    try {
        jsspeccy.start();
    } catch (e) {
        console.error(e);
    }
}

function* handleExitActions(_) {
    try {
        jsspeccy.exit();
    } catch (e) {
        console.error(e);
    }
}

function* handleOpenFileDialogActions(_) {
    try {
        yield put(resetProject());
        yield put(showActiveEmulator());
        jsspeccy.openFileDialog();
    } catch (e) {
        console.error(e);
    }
}

function* handleViewFullScreenActions(_) {
    try {
        jsspeccy.start();
        jsspeccy.enterFullscreen();
    } catch (e) {
        console.error(e);
    }
}

function* handleLocationChanges(action) {
    try {
        const path = action.payload.location.pathname;
        const match = typeof previousPath === 'undefined' || path === previousPath;

        if (!match || (path !== '/' && !path.startsWith('/projects/'))) {
            jsspeccy?.pause();
        }

        previousPath = path;
    } catch (e) {
        console.error(e);
    }
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
