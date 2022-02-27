export const actionTypes = {
    setSelectedTabIndex: 'project/setSelectedTabIndex',
    showNewProjectForm: 'project/showNewProjectForm',
    createNewProject: 'project/createNewProject',
    setReady: 'project/setReady',
    downloadTape: 'project/downloadTape',
    setCode: 'project/setCode',
    runCode: 'project/runCode',
};

export const setSelectedTabIndex = (index) => ({
    type: actionTypes.setSelectedTabIndex,
    index
})

export const showNewProjectForm = (projectType) => ({
    type: actionTypes.showNewProjectForm,
    projectType
})

export const createNewProject = (projectType, name) => ({
    type: actionTypes.createNewProject,
    projectType, name
})

export const setReady = (ready) => ({
    type: actionTypes.setReady,
    ready
})

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
