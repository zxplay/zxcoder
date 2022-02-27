export const actionTypes = {
    setAssemblyCode: 'demo/setAssemblyCode',
    setSinclairBasicCode: 'demo/setSinclairBasicCode',
    setZXBasicCode: 'demo/setZXBasicCode',
    runAssembly: 'demo/runAssembly',
    runSinclairBasic: 'demo/runSinclairBasic',
    runZXBasic: 'demo/runZXBasic',
};

export const setAssemblyCode = (asm) => ({
    type: actionTypes.setAssemblyCode,
    asm
})

export const setSinclairBasicCode = (basic) => ({
    type: actionTypes.setSinclairBasicCode,
    basic
})

export const setZXBasicCode = (basic) => ({
    type: actionTypes.setZXBasicCode,
    basic
})

export const runAssembly = () => ({
    type: actionTypes.runAssembly
})

export const runSinclairBasic = () => ({
    type: actionTypes.runSinclairBasic
})

export const runZXBasic = () => ({
    type: actionTypes.runZXBasic
})
