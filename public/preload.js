const remote = require('electron').remote
var fs = require('fs')

window.electron = remote

const { dialog } = remote

const filters = [{ name: 'Cadenza Files', extensions: ['cdza'] }]

window.open = async ({ browserWindow, callback }) => {
    const { filePaths } = await dialog.showOpenDialog(browserWindow, {
        title: 'Open file',
        filters,
        properties: ['openFile']
    })

    if (filePaths.length > 0) {
        const filePath = filePaths[0]
        fs.readFile(filePath, 'utf-8', (error, data) => {
            if (error) {
                callback({ error })
            } else {
                callback({ data: JSON.parse(data), filePath })
            }
        })
    }
}

window.save = async ({ data, filePath, callback }) => {
    fs.writeFile(filePath, JSON.stringify(data, null, 2), error => callback(error, filePath))
}

window.saveAs = async ({ browserWindow, data, defaultPath, callback }) => {
    const { filePath } = await dialog.showSaveDialog(browserWindow, {
        title: 'Save file',
        defaultPath,
        filters,
        properties: ['createDirectory', 'showOverwriteConfirmation']
    })

    if (filePath) {
        window.save({ data, filePath, callback })
    }
}
