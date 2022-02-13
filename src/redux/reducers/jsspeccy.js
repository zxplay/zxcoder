import {actionTypes} from "../actions/jsspeccy";
import {JSSpeccy} from "../../lib/emulator/JSSpeccy";

// -----------------------------------------------------------------------------
// Initial state
// -----------------------------------------------------------------------------

const initialState = {
    jsspeccy: undefined
};

// -----------------------------------------------------------------------------
// Actions
// -----------------------------------------------------------------------------

function renderEmulator(state, action) {
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

    const jsspeccy = JSSpeccy(target, emuParams);
    // jsspeccy.hideUI();

    if (doFilter) {
        // TODO: Investigate this option, and narrow the element selector.
        document.getElementsByTagName('canvas')[0].style.imageRendering = "auto";
    }

    return {...state, jsspeccy};
}

function handleClick(state, action) {
    const emuElem = document.querySelector('#jsspeccy');
    const keybElem = document.querySelector('#guiparent');
    if (!emuElem.contains(action.e.target) && !keybElem.contains(action.e.target)) {
        state.jsspeccy.pause();
    }

    // There's no change to state here.
    return {...state};
}

function exit(state, _) {
    state.jsspeccy.exit();

    // There's no change to state here.
    return {...state};
}

// -----------------------------------------------------------------------------
// Reducer
// -----------------------------------------------------------------------------

const actionsMap = {
    [actionTypes.renderEmulator]: renderEmulator,
    [actionTypes.handleClick]: handleClick,
    [actionTypes.exit]: exit,
};

export default function reducer(state = initialState, action) {
    const reducerFunction = actionsMap[action.type];
    return reducerFunction ? reducerFunction(state, action) : state;
}
