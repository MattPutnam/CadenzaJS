import React from 'react'

import EditPage from './pages/EditPage'
import PerformPage from './pages/PerformPage'

import * as Midi from './utils/Midi'
import { songCompare } from './utils/SongAndMeasureNumber'

import * as data from './sampleData.json'


class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      perform: false,
      midiInterfaces: {
        inputs: [],
        outputs: []
      },
      data: data.default
    }
  }

  render() {
    const { perform, midiInterfaces, data } = this.state
    const setData = ({ sortSongs }) => {
      if (sortSongs) {
        data.show.songs.sort(songCompare)
      }
      this.setState({ data })
    }

    return perform ?
      <PerformPage exit={() => this.setState({ perform: false })}/> :
      <EditPage perform={() => this.setState({ perform: true })} {...{ midiInterfaces, data, setData }}/>
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
          const parsed = Midi.parseMidiMessage(message)
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
