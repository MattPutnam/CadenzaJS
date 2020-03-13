import React from 'react'
import _ from 'lodash'
import Container from '../components/Container'
import { Flex, Spacer, Center } from '../components/Flex'
import PortSelector, { MidiDevicePlaceholder } from '../components/PortSelector'
import ChannelSelector from '../components/ChannelSelector'
import SynthSelector from '../components/SynthSelector'
import Button from '../components/Button'
import Keyboard from '../components/Keyboard'
import { findId } from '../utils/IdFinder'
import MidiListener from '../components/MidiListener'
import { FaArrowUp, FaArrowDown, FaTrash } from 'react-icons/fa'

const styles = {
    pedalContainer: {
        display: 'flex'
    },
    pedalItem: {
        flex: '1 1 auto'
    }
}

const KeyboardConfig = ({ keyboard, deleteSelf, midiDevices, moveUp, moveDown }) => {
    return <Container inner>
        <Flex>
            <PortSelector id={`inDevice${keyboard.id}`} devices={midiDevices} io="inputs" selected={keyboard.device}/>
            <ChannelSelector id={`keyboard${keyboard.id}`} selected={keyboard.channel} setSelected={() => undefined}/>
            <Spacer/>
            {moveUp && <Button onClick={moveUp} iconButton><FaArrowUp/></Button>}
            {moveDown && <Button onClick={moveDown} iconButton><FaArrowDown/></Button>}
            <Button onClick={deleteSelf} iconButton><FaTrash/></Button>
        </Flex>
        <Center>
            <Keyboard keyboard={keyboard} style={{margin: '0.5rem'}}/>
        </Center>
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
        <PortSelector id={`outDevice${synth.id}`} devices={midiDevices} io="outputs" selected={synth.device}/>
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
        const { data, midiDevices, setData } = this.props
        const { keyboards, synthesizers, editPedal, sustainPedal } = data.setup
        const moveUp = (index) => () => {
            const elem = keyboards[index]
            const prev = keyboards[index-1]
            keyboards[index-1] = elem
            keyboards[index] = prev
            setData(data)
        }
        const moveDown = (index) => () => {
            const elem = keyboards[index]
            const next = keyboards[index+1]
            keyboards[index+1] = elem
            keyboards[index] = next
            setData(data)
        }

        return <>
            <Container title="Keyboards">
                {keyboards.map((keyboard, index) =>
                    <KeyboardConfig key={keyboard.id}
                                    keyboard={keyboard}
                                    midiDevices={midiDevices}
                                    deleteSelf={() => this.deleteKeyboard(index)}
                                    moveUp={index > 0 ? moveUp(index) : undefined}
                                    moveDown={index < keyboards.length-1 ? moveDown(index) : undefined}/>
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
