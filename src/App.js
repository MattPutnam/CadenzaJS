import React from 'react'
import _ from 'lodash'

import EditPage from './pages/EditPage'
import PerformPage from './pages/PerformPage'

import * as Midi from './utils/Midi'

import * as data from './sampleData.json'


const MAX_UNDO_DEPTH = 50

const isMac = window.electron.process.platform === 'darwin'
const menuTemplate = ({ undo, redo }) => [
    ...(isMac ? [{
        label: 'Cadenza',
        submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideothers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' }
        ]
    }] : []),
    {
        label: 'File',
        submenu: [
            isMac ? { role: 'close' } : { role: 'quit' }
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


class App extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {
            perform: false,
            midiInterfaces: {
                inputs: [],
                outputs: []
            },
            data: data.default,
            undoStack: [],
            redoStack: []
        }

        this.prevState = _.cloneDeep(this.state.data)
    }
    
    render() {
        const { perform, midiInterfaces, data, undoStack, redoStack } = this.state
        const setData = () => {
            const { undoStack } = this.state
            undoStack.push(this.prevState)
            if (undoStack.length > MAX_UNDO_DEPTH) {
                undoStack.shift()
            }
            this.prevState = _.cloneDeep(data)

            this.setState({ data, undoStack, redoStack: [] })
        }
        
        const { Menu } = window.electron

        const undo = _.last(undoStack) ? { label: 'Undo', click: () => this.undo() } : undefined
        const redo = _.last(redoStack) ? { label: 'Redo', click: () => this.redo() } : undefined

        Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate({ undo, redo })))

        return perform ?
        <PerformPage exit={() => this.setState({ perform: false })}/> :
        <EditPage perform={() => this.setState({ perform: true })} {...{ midiInterfaces, data, setData }}/>
    }

    undo() {
        const { undoStack, redoStack, data } = this.state
        const currentState = _.cloneDeep(data)
        const prevState = undoStack.pop()
        redoStack.push(currentState)
        this.setState({ data: prevState, undoStack, redoStack })
    }

    redo() {
        const { undoStack, redoStack, data } = this.state
        const currentState = _.cloneDeep(data)
        const nextState = redoStack.pop()
        undoStack.push(currentState)
        this.setState({ data: nextState, undoStack, redoStack })
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
                        this.setState(midiInterfaces)
                    }
                } else if (port.state === 'disconnected') {
                    midiInterfaces[key] = midiInterfaces[key].filter(midiInterface => midiInterface.id !== port.id)
                    this.setState(midiInterfaces)
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
