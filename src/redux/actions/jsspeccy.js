export const actionTypes = {
    renderEmulator: 'jsspeccy/renderEmulator',
    loadEmulator: 'jsspeccy/loadEmulator',
    loadTape: 'jsspeccy/loadTape',
    handleClick: 'jsspeccy/handleClick',
    reset: 'jsspeccy/reset',
    pause: 'jsspeccy/pause',
    exit: 'jsspeccy/exit',
    showOpenFileDialog: 'jsspeccy/openFileDialog',
    showGameBrowser: 'jsspeccy/showGameBrowser',
    viewFullScreen: 'jsspeccy/viewFullScreen',
    setSelectedTabIndex: 'jsspeccy/setSelectedTabIndex',
};

export const renderEmulator = (zoom) => ({
    type: actionTypes.renderEmulator,
    zoom
});

export const loadEmulator = (target) => ({
    type: actionTypes.loadEmulator,
    target
});

export const loadTape = (tap) => ({
    type: actionTypes.loadTape,
    tap
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

export const viewFullScreen = () => ({
    type: actionTypes.viewFullScreen
})

export const setSelectedTabIndex = (index) => ({
    type: actionTypes.setSelectedTabIndex,
    index
})
