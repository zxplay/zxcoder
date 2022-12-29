export const actionTypes = {
    setSelectedTabIndex: 'demo/setSelectedTabIndex',
    setAssemblyCode: 'demo/setAssemblyCode',
    setSinclairBasicCode: 'demo/setSinclairBasicCode',
    setZXBasicCode: 'demo/setZXBasicCode',
    setCCode: 'demo/setCCode',
    runAssembly: 'demo/runAssembly',
    runSinclairBasic: 'demo/runSinclairBasic',
    runZXBasic: 'demo/runZXBasic',
    runC: 'demo/runC',
};

export const setSelectedTabIndex = (index) => ({
    type: actionTypes.setSelectedTabIndex,
    index
})

export const setAssemblyCode = (code) => ({
    type: actionTypes.setAssemblyCode,
    code
});

export const setSinclairBasicCode = (code) => ({
    type: actionTypes.setSinclairBasicCode,
    code
});

export const setZXBasicCode = (code) => ({
    type: actionTypes.setZXBasicCode,
    code
});

export const setCCode = (code) => ({
    type: actionTypes.setCCode,
    code
});

export const runAssembly = () => ({
    type: actionTypes.runAssembly
});

export const runSinclairBasic = () => ({
    type: actionTypes.runSinclairBasic
});

export const runZXBasic = () => ({
    type: actionTypes.runZXBasic
});

export const runC = () => ({
    type: actionTypes.runC
});
