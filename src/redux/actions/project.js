export const actionTypes = {
    setSelectedTabIndex: 'project/setSelectedTabIndex',
    showNewProjectForm: 'project/showNewProjectForm',
    createNewProject: 'project/createNewProject',
    setReady: 'project/setReady',
    showProjectIndex: 'project/showProjectIndex',
    downloadTape: 'project/downloadTape',
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

export const showProjectIndex = () => ({
    type: actionTypes.showProjectIndex
});

export const downloadTape = () => ({
    type: actionTypes.downloadTape
});
