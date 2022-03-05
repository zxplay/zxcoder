export const actionTypes = {
    reset: 'project/reset',
    setSelectedTabIndex: 'project/setSelectedTabIndex',
    createNewProject: 'project/createNewProject',
    loadProject: 'project/loadProject',
    receiveLoadedProject: 'project/receiveLoadedProject',
    downloadTape: 'project/downloadTape',
    setCode: 'project/setCode',
    setSavedCode: 'project/setSavedCode',
    runCode: 'project/runCode',
    saveCodeChanges: 'project/saveCodeChanges',
    deleteProject: 'project/deleteProject',
};

export const reset = () => ({
    type: actionTypes.reset
});

export const setSelectedTabIndex = (index) => ({
    type: actionTypes.setSelectedTabIndex,
    index
});

export const createNewProject = (projectType, title) => ({
    type: actionTypes.createNewProject,
    projectType, title
});

export const loadProject = (id) => ({
    type: actionTypes.loadProject,
    id
});

export const receiveLoadedProject = (id, title, lang, code) => ({
    type: actionTypes.receiveLoadedProject,
    id, title, lang, code
});

export const downloadTape = () => ({
    type: actionTypes.downloadTape
});

export const setCode = (code) => ({
    type: actionTypes.setCode,
    code
});

export const setSavedCode = (code) => ({
    type: actionTypes.setSavedCode,
    code
});

export const runCode = () => ({
    type: actionTypes.runCode
});

export const saveCodeChanges = () => ({
    type: actionTypes.saveCodeChanges
});

export const deleteProject = () => ({
    type: actionTypes.deleteProject
});
