// @ts-ignore
declare function importScripts(path: string);

// @ts-ignore
const ENVIRONMENT_IS_WEB = typeof window === 'object';
const ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';

// @ts-ignore
export const emglobal: any = ENVIRONMENT_IS_WORKER ? self : ENVIRONMENT_IS_WEB ? window : global;

export const WORKER_RELATIVE_PATH = "../8bitworker/";
