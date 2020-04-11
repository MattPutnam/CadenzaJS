import React from 'react'
import _ from 'lodash'

import Top from './Top'

import * as Midi from './utils/Midi'

import * as data from './sampleData.json'

const DEVELOP =  true


const MAX_UNDO_DEPTH = 50

const isMac = window.electron.process.platform === 'darwin'
const menuTemplate = ({ newFile, open, save, saveAs, quit, undo, redo }) => [
    ...(isMac ? [{
        label: 'Cadenza',
        submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideothers' },
            { role: 'unhide' },
            { type: 'separator' },
            { label: 'Quit Cadenza', accelerator: 'CmdOrCtrl+Q', click: quit }
        ]
    }] : []),
    {
        label: 'File',
        submenu: [
            ...(newFile ? [{ label: 'New File', accelerator: 'CmdOrCtrl+N', click: newFile }] : []),
            ...(open ? [{ label: 'Open...', accelerator: 'CmdOrCtrl+O', click: open }] : []),
            ...(newFile || open ? [{ type: 'separator' }] : []),
            ...(save ? [{ label: 'Save', accelerator: 'CmdOrCtrl+S', click: save }] : []),
            ...(saveAs ? [{ label: 'Save as...', accelerator: 'CmdOrCtrl+Shift+S', click: saveAs }] : []),
            ...(save || saveAs ? [{ type: 'separator' }] : []),
            isMac ? { role: 'close' } : { label: 'Quit Cadenza', accelerator: 'CmdOrCtrl+Q', click: quit }
        ]
    },
    {
        label: 'Edit',
        submenu: [
            ...(undo ? [{ ...undo, accelerator: 'CmdOrCtrl+Z' }] : []),
            ...(redo ? [{ ...redo, accelerator: 'CmdOrCtrl+Shift+Z' }] : []),
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' }
        ]
    },
    {
        label: 'View',
        submenu: [
            { role: 'reload' },
            { role: 'forcereload' },
            { type: 'separator' },
            { role: 'resetzoom' },
            { role: 'zoomin' },
            { role: 'zoomout' },
            { type: 'separator' },
            { role: 'togglefullscreen' }
        ]
    },
    {
        label: 'Window',
        submenu: [
            { role: 'minimize' },
            { role: 'zoom' },
            ...(isMac ? [
                { type: 'separator' },
                { role: 'front' },
                { type: 'separator' },
                { role: 'window' }
            ] : [
                { role: 'close' }
            ])
        ]
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'Manual',
                click: async () => {
                    const { shell } = window.electron
                    await shell.openExternal('http://mattputnam.org/cadenza/index.html')
                }
            }
        ]
    }
]

const initialData = {
    setup: {
        keyboards: [],
        synthesizers: []
    },
    patches: [],
    show: {
        songs: [],
        cues: []
    }
}


class App extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {
            midiInterfaces: {
                inputs: [],
                outputs: []
            },
            data: DEVELOP ? data.default : initialData,
            undoStack: [],
            redoStack: [],
            coalescionKey: undefined,
            dirty: DEVELOP,
            filePath: undefined
        }

        this.storedState = _.cloneDeep(this.state.data)

        this.browserWindow = window.electron.BrowserWindow.getAllWindows()[0]
    }
    
    render() {
        const { midiInterfaces, data, undoStack, redoStack, coalescionKey, dirty, filePath } = this.state
        const setData = (message, key) => {
            const { undoStack } = this.state

            let targetState = this.storedState
            if (key !== undefined && _.isEqual(key, coalescionKey)) {
                targetState = undoStack.pop().state
            }

            undoStack.push({ state: _.cloneDeep(targetState), message })
            if (undoStack.length > MAX_UNDO_DEPTH) {
                undoStack.shift()
            }

            this.setState({ data, undoStack, redoStack: [], coalescionKey: key, dirty: true })
            this.storedState = _.cloneDeep(data)
        }

        const { Menu } = window.electron

        const newFile = () => this.newFile()
        const open = () => this.open()
        const quit = () => this.quit()

        const save = filePath ? () => this.save() : () => this.saveAs()
        const saveAs = filePath ? () => this.saveAs() : undefined

        const undoTop = _.last(undoStack)
        const redoTop = _.last(redoStack)

        const undo = undoTop ? { label: `Undo ${undoTop.message || ''}`, click: () => this.undo() } : undefined
        const redo = redoTop ? { label: `Redo ${redoTop.message || ''}`, click: () => this.redo() } : undefined

        Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate({ newFile, open, save, saveAs, quit, undo, redo })))
        document.title = 'Cadenza' + (filePath ? ` - ${filePath}` : '') + (dirty ? '  — Edited' : '')
        this.browserWindow.setDocumentEdited(dirty)

        return <Top key={filePath || 'UNSAVED'} {...{ midiInterfaces, data, setData }}/>
    }

    newFile() {
        if (this.confirmClose()) {
            this.setState({ data: initialData, dirty: true, filePath: undefined })
        }
    }

    open() {
        if (this.confirmClose()) {
            window.open({
                browserWindow: this.browserWindow,
                callback: ({ error, data, filePath }) => {
                    if (error) {
                        console.log(error)
                    } else {
                        this.setState({ dirty: false, data, filePath })
                    }
                }
            })
        }
    }

    quit() {
        if (this.confirmClose()) {
            window.electron.app.quit()
        }
    }

    confirmClose() {
        const { dirty } = this.state

        if (dirty) {
            const choice = window.electron.dialog.showMessageBoxSync(this.browserWindow, {
                type: 'question',
                buttons: ['Yes', 'No'],
                title: 'Confirm',
                message: 'Are you sure you want to close this file? Unsaved changes will be lost.'
            })
            return choice === 0
        }

        return true
    }

    save() {
        const { data, filePath } = this.state

        window.save({
            data, filePath,
            callback: error => {
                if (error) {
                    console.log(error)
                } else {
                    this.setState({ dirty: false })
                }
            }
        })
    }

    saveAs() {
        const { data, filePath } = this.state

        window.saveAs({
            browserWindow: this.browserWindow,
            data, filePath,
            callback: (error, newPath) => {
                if (error) {
                    console.log(error)
                } else {
                    this.setState({ dirty: false, filePath: newPath })
                }
            }
        })
    }

    undo() {
        const { undoStack, redoStack, data } = this.state
        const currentState = data
        const prevState = undoStack.pop()
        redoStack.push({ state: currentState, message: prevState.message })

        this.setState({ data: prevState.state, undoStack, redoStack, coalescionKey: undefined, dirty: true })
        this.storedState = _.cloneDeep(prevState.state)
    }

    redo() {
        const { undoStack, redoStack, data } = this.state
        const currentState = data
        const nextState = redoStack.pop()
        undoStack.push({ state: currentState, message: nextState.message })

        this.setState({ data: nextState.state, undoStack, redoStack, coalescionKey: undefined, dirty: true })
        this.storedState = _.cloneDeep(nextState.state)
    }
    
    componentDidMount() {
        navigator.requestMIDIAccess().then(access => {
            access.onstatechange = ({ port }) => {
                const { midiInterfaces } = this.state
                const key = `${port.type}s`
                
                if (port.state === 'connected') {
                    const arr = midiInterfaces[key]
                    if (!arr.some(midiInterface => midiInterface.id === port.id)) {
                        arr.push(port)
                        this.setState({ midiInterfaces })
                    }
                } else if (port.state === 'disconnected') {
                    midiInterfaces[key] = midiInterfaces[key].filter(midiInterface => midiInterface.id !== port.id)
                    this.setState({ midiInterfaces })
                }
            }
            
            let iterator = access.inputs.values()
            let item = iterator.next()
            const inputs = []
            while (!item.done) {
                const input = item.value
                input.onmidimessage = message => {
                    const parsed = Midi.parseMidiMessage(message, this.state.data.setup.keyboards)
                    Midi.notifyMidiListeners(parsed)
                }
                inputs.push(input)
                item = iterator.next()
            }
            
            iterator = access.outputs.values()
            item = iterator.next()
            const outputs = []
            while (!item.done) {
                outputs.push(item.value)
                item = iterator.next()
            }
            
            this.setState({ midiInterfaces: { inputs, outputs } })
        })
    }
}

export default App
