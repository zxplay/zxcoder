export const actionTypes = {
    renderEmulator: 'jsspeccy/renderEmulator',
    handleClick: 'jsspeccy/handleClick',
    reset: 'jsspeccy/reset',
    pause: 'jsspeccy/pause',
    exit: 'jsspeccy/exit',
    showOpenFileDialog: 'jsspeccy/openFileDialog',
    showGameBrowser: 'jsspeccy/showGameBrowser',
    runBasic: 'jsspeccy/runBasic',
    runAssembly: 'jsspeccy/runAssembly',
};

export const renderEmulator = (target, zoom) => ({
    type: actionTypes.renderEmulator,
    target, zoom
});

export const handleClick = (e) => ({
    type: actionTypes.handleClick,
    e
});

export const reset = () => ({
    type: actionTypes.reset
})

export const pause = () => ({
    type: actionTypes.pause
})

export const exit = () => ({
    type: actionTypes.exit
})

export const showOpenFileDialog = () => ({
    type: actionTypes.showOpenFileDialog
})

export const showGameBrowser = () => ({
    type: actionTypes.showGameBrowser
})

export const runBasic = (basic) => ({
    type: actionTypes.runBasic,
    basic
})

export const runAssembly = (asm) => ({
    type: actionTypes.runAssembly,
    asm
})
