import {createStore, combineReducers, applyMiddleware} from "redux";
import createSagaMiddleware from "redux-saga";
import {all} from "redux-saga/effects";
import {connectRouter, routerMiddleware} from "connected-react-router";
import {createBrowserHistory} from "history";
import Constants from "../constants";

// Reducers
import asmReducer from "./reducers/asm";
import basicReducer from "./reducers/basic";
import errorReducer from "./reducers/error";
import identityReducer from "./reducers/identity";
import jsspeccyReducer from "./reducers/jsspeccy";
import zxbasicReducer from "./reducers/zxbasic";

// Sagas
import * as asmSagas from "./sagas/asm";
import * as basicSagas from "./sagas/basic";
import * as identitySagas from "./sagas/identity";
import * as jsspeccySagas from "./sagas/jsspeccy";
import * as zxbasicSagas from "./sagas/zxbasic";

const loggingMiddleware = (store) => {
    return (next) => {
        return (action) => {

            // noinspection JSUnresolvedVariable
            if (Constants.logActions) {
                const collapsed = false;
                const msg = `Action: ${action.type}`;
                if (collapsed) console.groupCollapsed(msg); else console.group(msg);
                console.log('Action:', action);
                console.log('Previous state:', store.getState());
            }

            const result = next(action);

            // noinspection JSUnresolvedVariable
            if (Constants.logActions) {
                console.log('New state:', store.getState());
                console.groupEnd();
            }

            return result;
        }
    }
};

export const history = createBrowserHistory();
const sagaMiddleware = createSagaMiddleware();

const rootReducer = combineReducers({
    router: connectRouter(history),
    asm: asmReducer,
    basic: basicReducer,
    error: errorReducer,
    identity: identityReducer,
    jsspeccy: jsspeccyReducer,
    zxbasic: zxbasicReducer,
});

export const store = createStore(
    rootReducer,
    applyMiddleware(
        routerMiddleware(history),
        loggingMiddleware,
        sagaMiddleware));

const sagas = [];

function collectSagas(file) {
    for (const name in file) {
        if (file.hasOwnProperty(name)) {
            sagas.push(file[name]());
        }
    }
}

collectSagas(asmSagas);
collectSagas(basicSagas);
collectSagas(identitySagas);
collectSagas(jsspeccySagas);
collectSagas(zxbasicSagas);

function* rootSaga() {
    yield all(sagas);
}

sagaMiddleware.run(rootSaga);
