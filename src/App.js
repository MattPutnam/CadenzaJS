import React from 'react'
import EditPage from './pages/EditPage'
import PerformPage from './pages/PerformPage'

import * as data from './sampleData.json'

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      perform: false,
      midiDevices: {
        inputs: [],
        outputs: []
      },
      showData: data.default
    }
  }

  render() {
    const { perform, midiDevices, showData } = this.state

    return perform ?
      <PerformPage exit={() => this.setState({ perform: false })}/> :
      <EditPage perform={() => this.setState({ perform: true })} {...{ midiDevices, showData }}/>
  }

  componentDidMount() {
    // The effect hook was not working for this, hence the manual lifecycle management:
    navigator.requestMIDIAccess().then(access => {
      access.onstatechange = ({ port }) => {
        const { midiDevices } = this.state
        const key = `${port.type}s`

        if (port.state === 'connected') {
          const arr = midiDevices[key]
          if (!arr.some(device => device.id === port.id)) {
            arr.push(port)
            this.setState(midiDevices)
          }
        } else if (port.state === 'disconnected') {
          midiDevices[key] = midiDevices[key].filter(device => device.id !== port.id)
          this.setState(midiDevices)
        }
      }

      let iterator = access.inputs.values()
      let item = iterator.next()
      const inputs = []
      while (!item.done) {
        inputs.push(item.value)
        item = iterator.next()
      }

      iterator = access.outputs.values()
      item = iterator.next()
      const outputs = []
      while (!item.done) {
        outputs.push(item.value)
        item = iterator.next()
      }

      this.setState({ midiDevices: { inputs, outputs } })
    })
  }
}

export default App
