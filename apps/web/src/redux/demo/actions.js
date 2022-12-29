export const actionTypes = {
    setSelectedTabIndex: 'demo/setSelectedTabIndex',
    setAssemblyCode: 'demo/setAssemblyCode',
    setSinclairBasicCode: 'demo/setSinclairBasicCode',
    runAssembly: 'demo/runAssembly',
    runSinclairBasic: 'demo/runSinclairBasic',
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

export const runAssembly = () => ({
    type: actionTypes.runAssembly
});

export const runSinclairBasic = () => ({
    type: actionTypes.runSinclairBasic
});
