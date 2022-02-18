import {take, takeLatest, put, call} from "redux-saga/effects";
import {eventChannel} from "redux-saga";
import {handleClick} from "../actions/jsspeccy";
import {JSSpeccy} from "../../lib/emulator/JSSpeccy";
import {actionTypes} from "../actions/jsspeccy";
import bas2tap from "bas2tap";
import pasmo from "pasmo";

// -----------------------------------------------------------------------------
// Action watchers
// -----------------------------------------------------------------------------

export function* watchForRenderEmulatorActions() {
    yield takeLatest(actionTypes.renderEmulator, handleRenderEmulatorActions);
}

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

export function* watchForHandleClickActions() {
    yield takeLatest(actionTypes.handleClick, handleClickActions);
}

export function* watchForResetActions() {
    yield takeLatest(actionTypes.reset, handleResetActions);
}

export function* watchForPauseActions() {
    yield takeLatest(actionTypes.pause, handlePauseActions);
}

export function* watchForExitActions() {
    yield takeLatest(actionTypes.exit, handleExitActions);
}

export function* watchForOpenFileDialogActions() {
    yield takeLatest(actionTypes.showOpenFileDialog, handleOpenFileDialogActions);
}

export function* watchForShowGameBrowserActions() {
    yield takeLatest(actionTypes.showGameBrowser, handleShowGameBrowserActions);
}

export function* watchForRunBasicActions() {
    yield takeLatest(actionTypes.runBasic, handleRunBasicActions);
}

export function* watchForRunAssemblyActions() {
    yield takeLatest(actionTypes.runAssembly, handleRunAssemblyActions);
}

export function* watchForViewFullScreenActions() {
    yield takeLatest(actionTypes.viewFullScreen, handleViewFullScreenActions);
}

// -----------------------------------------------------------------------------
// Action handlers
// -----------------------------------------------------------------------------

function* handleRenderEmulatorActions(action) {
    const zoom = action.zoom || 2;
    const target = action.target || document.getElementById('jsspeccy');

    const emuParams = {
        zoom,
        sandbox: false,
        autoLoadTapes: true,
    };

    let doFilter = false;

    const url = new URL(window.location.href);
    for (const [key, value] of url.searchParams) {
        if (key === 'm') {
            if (value === '48' || value === '128' || value === '5') {
                emuParams.machine = value;
            }
        } else if (key === 'u') {
            emuParams.openUrl = value;
        } else if (key === 'f') {
            if (value && value !== '0') {
                doFilter = true;
            }
        }
    }

    jsspeccy = JSSpeccy(target, emuParams);
    jsspeccy.hideUI();

    if (doFilter) {
        // TODO: Investigate this option, and narrow the element selector.
        document.getElementsByTagName('canvas')[0].style.imageRendering = "auto";
    }
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
    jsspeccy.start();
    jsspeccy.reset();
}

function* handlePauseActions(_) {
    jsspeccy.pause();
}

function* handleExitActions(_) {
    jsspeccy.exit();
}

function* handleOpenFileDialogActions(_) {
    jsspeccy.openFileDialog();
}

function* handleShowGameBrowserActions(_) {
    jsspeccy.openGameBrowser();
}

function* handleRunBasicActions(action) {
    const basic = action.basic;
    const tap = yield bas2tap(basic);
    jsspeccy.start();
    jsspeccy.openTAPFile(tap.buffer);
}

function* handleRunAssemblyActions(action) {
    const asm = action.asm;
    const tap = yield pasmo(asm);
    jsspeccy.start();
    jsspeccy.openTAPFile(tap.buffer);
}

function* handleViewFullScreenActions(action) {
    jsspeccy.start();
    jsspeccy.enterFullscreen();
}

// -----------------------------------------------------------------------------
// Supporting code
// -----------------------------------------------------------------------------

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
