export const actionTypes = {
    renderEmulator: 'jsspeccy/renderEmulator',
    loadEmulator: 'jsspeccy/loadEmulator',
    loadTape: 'jsspeccy/loadTape',
    loadUrl: 'jsspeccy/loadUrl',
    handleClick: 'jsspeccy/handleClick',
    reset: 'jsspeccy/reset',
    pause: 'jsspeccy/pause',
    exit: 'jsspeccy/exit',
    showOpenFileDialog: 'jsspeccy/openFileDialog',
    viewFullScreen: 'jsspeccy/viewFullScreen',
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

export const loadUrl = (url) => ({
    type: actionTypes.loadUrl,
    url
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

export const viewFullScreen = () => ({
    type: actionTypes.viewFullScreen
})
