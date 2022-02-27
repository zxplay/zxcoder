import {createStore, combineReducers, applyMiddleware} from "redux";
import createSagaMiddleware from "redux-saga";
import {all} from "redux-saga/effects";
import {connectRouter, routerMiddleware} from "connected-react-router";
import {createBrowserHistory} from "history";
import Constants from "../constants";

// Reducers
import demoReducer from "./reducers/demo";
import errorReducer from "./reducers/error";
import identityReducer from "./reducers/identity";
import jsspeccyReducer from "./reducers/jsspeccy";
import profileReducer from "./reducers/profile";
import projectReducer from "./reducers/project";

// Sagas
import * as demoSagas from "./sagas/demo";
import * as errorSagas from "./sagas/error";
import * as identitySagas from "./sagas/identity";
import * as jsspeccySagas from "./sagas/jsspeccy";
import * as profileSagas from "./sagas/profile";
import * as projectSagas from "./sagas/project";

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
    demo: demoReducer,
    error: errorReducer,
    identity: identityReducer,
    jsspeccy: jsspeccyReducer,
    profile: profileReducer,
    project: projectReducer,
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

collectSagas(demoSagas);
collectSagas(errorSagas);
collectSagas(identitySagas);
collectSagas(jsspeccySagas);
collectSagas(profileSagas);
collectSagas(projectSagas);

function* rootSaga() {
    yield all(sagas);
}

sagaMiddleware.run(rootSaga);
