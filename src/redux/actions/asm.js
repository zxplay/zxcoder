export const actionTypes = {
    setAssemblyCode: 'asm/setAssemblyCode',
    runAssembly: 'asm/runAssembly',
};

export const setAssemblyCode = (asm) => ({
    type: actionTypes.setAssemblyCode,
    asm
})

export const runAssembly = () => ({
    type: actionTypes.runAssembly
})
