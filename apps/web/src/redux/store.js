import {createStore, combineReducers, applyMiddleware} from "redux";
import createSagaMiddleware from "redux-saga";
import {all} from "redux-saga/effects";
import {createRouterReducer, createRouterMiddleware} from "@lagunovsky/redux-react-router";
import {createBrowserHistory} from "history";
import Constants from "../constants";

// Reducers
import appReducer from "./reducers/app";
import demoReducer from "./reducers/demo";
import eightbitReducer from "./reducers/eightbit";
import errorReducer from "./reducers/error";
import identityReducer from "./reducers/identity";
import projectReducer from "./reducers/project";
import projectListReducer from "./reducers/projectList";
import subscriberReducer from "./reducers/subscriber";

// Sagas
import * as appSagas from "./sagas/app";
import * as demoSagas from "./sagas/demo";
import * as eightbitSagas from "./sagas/eightbit";
import * as identitySagas from "./sagas/identity";
import * as jsspeccySagas from "./sagas/jsspeccy";
import * as projectSagas from "./sagas/project";
import * as projectListSagas from "./sagas/projectList";
import * as subscriberSagas from "./sagas/subscriber";

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
    router: createRouterReducer(history),
    app: appReducer,
    demo: demoReducer,
    eightbit: eightbitReducer,
    error: errorReducer,
    identity: identityReducer,
    project: projectReducer,
    projectList: projectListReducer,
    subscriber:subscriberReducer,
});

export const store = createStore(
    rootReducer,
    applyMiddleware(
        createRouterMiddleware(history),
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

collectSagas(appSagas);
collectSagas(demoSagas);
collectSagas(eightbitSagas);
collectSagas(identitySagas);
collectSagas(jsspeccySagas);
collectSagas(projectSagas);
collectSagas(projectListSagas);
collectSagas(subscriberSagas);

function* rootSaga() {
    yield all(sagas);
}

sagaMiddleware.run(rootSaga);
