import React from 'react'
import Container from '../components/Container'
import { Flex, Spacer } from '../components/Flex'
import PortSelector, { MIDIDevicePlaceholder } from '../components/PortSelector'
import SynthSelector from '../components/SynthSelector'
import Button from '../components/Button'
import Keyboard from '../components/Keyboard'
import { findId } from '../utils/IdFinder'
import * as MIDI from '../utils/MIDI'

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
            <PortSelector devices={midiDevices} io="inputs" selected={keyboard.inputDevice}/>
            {multiple && <input/>}
            <Spacer/>
            <Button onClick={deleteSelf}>delete</Button>
        </Flex>
        <Keyboard keyboard={keyboard}/>
    </Container>
}

const KeyboardPlaceholder = ({ addKeyboard }) => {
    const style = {
        cursor: 'pointer'
    }

    React.useEffect(() => {
        const key = '###KEYBOARD_FINDER###'

        MIDI.pushMidiReceiver(msg => console.log(msg), key)

        return () => {
            MIDI.removeMidiReceiver(key)
        }
    }, [])

    return <Container inner style={style} onClick={() => addKeyboard()}>
        Click to add a keyboard
    </Container>
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

const SetupTab = ({ midiDevices, data, setData }) => {
    const { keyboards, synthesizers, editPedal, sustainPedal } = data.setup
    const addKeyboard = () => {
        keyboards.push({
            id: findId(keyboards),
            inputDevice: MIDIDevicePlaceholder,
            name: '',
            range: [21, 108]
        })
        setData(data)
    }
    const deleteKeyboard = (index) => {
        keyboards.splice(index, 1)
        setData(data)
    }

    const multipleKeyboards = keyboards.length > 1

    return <>
        <Container title="Keyboards">
            {keyboards.map((keyboard, index) =>
                <KeyboardConfig key={keyboard.id}
                                keyboard={keyboard}
                                multiple={multipleKeyboards}
                                midiDevices={midiDevices}
                                deleteSelf={() => deleteKeyboard(index)}/>
            )}
            <KeyboardPlaceholder addKeyboard={addKeyboard}/>
            <div style={styles.pedalContainer}>
                <EditPedalConfig pedal={editPedal}/>
                <SustainPedalConfig pedal={sustainPedal}/>
            </div>
        </Container>
        <Container title="Synthesizers">
            {synthesizers.map(synth => <SynthConfig key={synth.id} {...{ synth, midiDevices }}/>)}
            <SynthPlaceholder/>
        </Container>
    </>
}

export default SetupTab
