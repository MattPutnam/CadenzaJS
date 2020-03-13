import React from 'react'
import _ from 'lodash'
import Container from '../components/Container'
import { Flex, Spacer } from '../components/Flex'
import PortSelector, { MidiDevicePlaceholder } from '../components/PortSelector'
import SynthSelector from '../components/SynthSelector'
import Button from '../components/Button'
import Keyboard from '../components/Keyboard'
import { findId } from '../utils/IdFinder'
import MidiListener from '../components/MidiListener'

const styles = {
    pedalContainer: {
        display: 'flex'
    },
    pedalItem: {
        flex: '1 1 auto'
    }
}

const KeyboardConfig = ({ keyboard, multiple, deleteSelf, midiDevices }) => {
    return <Container inner>
        <Flex>
            <PortSelector devices={midiDevices} io="inputs" selected={keyboard.device}/>
            {keyboard.channel}
            {multiple && <input/>}
            <Spacer/>
            <Button onClick={deleteSelf}>delete</Button>
        </Flex>
        <Keyboard keyboard={keyboard}/>
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
        <PortSelector devices={midiDevices} io="outputs" selected={synth.device}/>
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
    render() {
        const { data: { setup : { keyboards, synthesizers, editPedal, sustainPedal } }, midiDevices } = this.props
        const multipleKeyboards = keyboards.length > 1

        return <>
            <Container title="Keyboards">
                {keyboards.map((keyboard, index) =>
                    <KeyboardConfig key={keyboard.id}
                                    keyboard={keyboard}
                                    multiple={multipleKeyboards}
                                    midiDevices={midiDevices}
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

        const device = parsedMessage ? parsedMessage.device : MidiDevicePlaceholder
        const channel = parsedMessage ? parsedMessage.channel : 0

        keyboards.push({
            id: findId(keyboards),
            device,
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
        const { device, channel } = parsedMessage

        if (!_.find(keyboards, { device, channel })) {
            this.addKeyboard(parsedMessage)
        }
    }
}

export default SetupTab
