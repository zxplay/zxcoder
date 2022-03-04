export const actionTypes = {
    reset: 'project/reset',
    setSelectedTabIndex: 'project/setSelectedTabIndex',
    showNewProjectForm: 'project/showNewProjectForm',
    hideNewProjectForm: 'project/hideNewProjectForm',
    createNewProject: 'project/createNewProject',
    loadProject: 'project/loadProject',
    receiveLoadedProject: 'project/receiveLoadedProject',
    setReady: 'project/setReady',
    downloadTape: 'project/downloadTape',
    setCode: 'project/setCode',
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

export const showNewProjectForm = (projectType) => ({
    type: actionTypes.showNewProjectForm,
    projectType
});

export const hideNewProjectForm = () => ({
    type: actionTypes.hideNewProjectForm
});

export const createNewProject = (title) => ({
    type: actionTypes.createNewProject,
    title
});

export const loadProject = (id) => ({
    type: actionTypes.loadProject,
    id
});

export const receiveLoadedProject = (id, title, lang, code) => ({
    type: actionTypes.receiveLoadedProject,
    id, title, lang, code
});

export const setReady = (ready) => ({
    type: actionTypes.setReady,
    ready
});

export const downloadTape = () => ({
    type: actionTypes.downloadTape
});

export const setCode = (code) => ({
    type: actionTypes.setCode,
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
