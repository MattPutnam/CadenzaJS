import React from 'react'
import _ from 'lodash'
import Container from '../components/Container'
import { Flex, Spacer } from '../components/Flex'
import PortSelector, { MIDIDevicePlaceholder } from '../components/PortSelector'
import SynthSelector from '../components/SynthSelector'
import Button from '../components/Button'
import Keyboard from '../components/Keyboard'
import { findId } from '../utils/IdFinder'
import * as MIDI from '../utils/MIDI'
import MidiListener from '../components/MidiListener'

const styles = {
    pedalContainer: {
        display: 'flex'
    },
    pedalItem: {
        flex: '1 1 auto'
    }
}

const KeyboardConfig = ({ keyboard, multiple, deleteSelf, midiDevices, activeNotes }) => {
    return <Container inner>
        <Flex>
            <PortSelector devices={midiDevices} io="inputs" selected={keyboard.inputDevice}/>
            {multiple && <input/>}
            <Spacer/>
            <Button onClick={deleteSelf}>delete</Button>
        </Flex>
        <Keyboard keyboard={keyboard} highlight={activeNotes}/>
    </Container>
}

const KeyboardPlaceholder = ({ addKeyboard }) => {
    return <Button onClick={() => addKeyboard()}>
        Add a keyboard, or press a key to auto discover
    </Button>
}

const SynthConfig = ({ synth, midiDevices }) => {
    return <Container inner>
        <SynthSelector selected={synth.name}/>
        <PortSelector devices={midiDevices} io="outputs" selected={synth.outputDevice}/>
    </Container>
}

const SynthPlaceholder = () => {
    return <Container inner>
        Hey! Add a synthesizer!
    </Container>
}

const EditPedalConfig = ({ pedal }) => {
    return <Container inner style={styles.pedalItem} title="Edit Pedal">
        Edit Pedal
    </Container>
}

const SustainPedalConfig = ({ pedal }) => {
    return <Container inner style={styles.pedalItem} title="Sustain Pedal">
        Sustain Pedal
    </Container>
}


class SetupTab extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            activeNotes: {}
        }
    }

    render() {
        const { data: { setup : { keyboards, synthesizers, editPedal, sustainPedal } }, midiDevices } = this.props
        const { activeNotes } = this.state
        const multipleKeyboards = keyboards.length > 1

        return <>
            <Container title="Keyboards">
                {keyboards.map((keyboard, index) =>
                    <KeyboardConfig key={keyboard.id}
                                    keyboard={keyboard}
                                    multiple={multipleKeyboards}
                                    midiDevices={midiDevices}
                                    activeNotes={activeNotes[keyboard.id]}
                                    deleteSelf={() => this.deleteKeyboard(index)}/>
                )}
                <KeyboardPlaceholder addKeyboard={() => this.addKeyboard()}/>
                <div style={styles.pedalContainer}>
                    <EditPedalConfig pedal={editPedal}/>
                    <SustainPedalConfig pedal={sustainPedal}/>
                </div>
            </Container>
            <Container title="Synthesizers">
                {synthesizers.map(synth => <SynthConfig key={synth.id} {...{ synth, midiDevices }}/>)}
                <SynthPlaceholder/>
            </Container>
            <MidiListener id='###SETUP_TAB###' dispatch={msg => this.handleMidi(msg)}/>
        </>
    }
    
    addKeyboard(parsedMessage) {
        const { data, data: { setup: { keyboards } }, setData } = this.props

        const inputDevice = parsedMessage ? parsedMessage.device : MIDIDevicePlaceholder
        const channel = parsedMessage ? parsedMessage.channel : 0

        keyboards.push({
            id: findId(keyboards),
            inputDevice,
            name: '',
            range: [21, 108],
            channel
        })
        setData(data)
    }

    deleteKeyboard(index) {
        const { data, data: { setup: { keyboards } }, setData } = this.props

        keyboards.splice(index, 1)
        setData(data)
    }

    handleMidi(parsedMessage) {
        const { data: { setup: { keyboards } } } = this.props
        if (_.isEmpty(keyboards)) {
            this.addKeyboard(parsedMessage)
            return
        }

        const { activeNotes } = this.state

        const { device } = parsedMessage
        const kbds = _.groupBy(keyboards, 'inputDevice')[device]
        let kbd
        if (kbds.length === 1) {
            kbd = kbds[0]
        } else if (kbds.length > 1) {
            kbd = _.find(kbds, k => k.channel === parsedMessage.channel)
        }

        if (!kbd) {
            this.addKeyboard(parsedMessage)
            return
        }
        
        const { type, note } = parsedMessage
        let notes = activeNotes[kbd.id]
        if (!notes) {
            notes = new Set()
        }
        if (type === MIDI.NOTE_ON) {
            notes.add(note)
        } else if (type === MIDI.NOTE_OFF) {
            notes.delete(note)
        }
        activeNotes[kbd.id] = notes
        this.setState({ activeNotes })
    }
}

export default SetupTab
