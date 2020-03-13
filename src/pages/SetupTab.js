import React from 'react'
import _ from 'lodash'
import Container from '../components/Container'
import { Flex, Spacer, Center } from '../components/Flex'
import InterfaceSelector, { MidiInterfacePlaceholder } from '../components/InterfaceSelector'
import ChannelSelector from '../components/ChannelSelector'
import SynthSelector from '../components/SynthSelector'
import Button from '../components/Button'
import Keyboard from '../components/Keyboard'
import { findId } from '../utils/IdFinder'
import MidiListener from '../components/MidiListener'
import { FaArrowUp, FaArrowDown, FaTrash } from 'react-icons/fa'
import KeyboardSizeSelector from '../components/KeyboardSizeSelector'

const styles = {
    pedalContainer: {
        display: 'flex'
    },
    pedalItem: {
        flex: '1 1 auto'
    }
}

const KeyboardConfig = ({ keyboard, deleteSelf, midiInterfaces, moveUp, moveDown, setData }) => {
    return <Container inner>
        <Flex>
            <InterfaceSelector hardware={keyboard}
                               midiInterfaces={midiInterfaces}
                               io="inputs"
                               setData={setData}/>
            <ChannelSelector keyboard={keyboard}
                             setData={setData}/>
            <Spacer/>
            {moveUp && <Button onClick={moveUp} iconButton><FaArrowUp/></Button>}
            {moveDown && <Button onClick={moveDown} iconButton><FaArrowDown/></Button>}
            <Button onClick={deleteSelf} iconButton><FaTrash/></Button>
        </Flex>
        <Center>
            <Keyboard keyboard={keyboard}/>
        </Center>
        <Center>
            <KeyboardSizeSelector keyboard={keyboard} setData={setData}/>
        </Center>
    </Container>
}

const KeyboardPlaceholder = ({ addKeyboard }) => {
    return <Button onClick={() => addKeyboard()}>
        Add a keyboard, or press a key to auto discover
    </Button>
}

const SynthConfig = ({ synth, midiInterfaces, setData }) => {
    return <Container inner>
        <SynthSelector selected={synth.name}/>
        <InterfaceSelector hardware={synth}
                           midiInterfaces={midiInterfaces}
                           io="outputs"
                           setData={setData}/>
    </Container>
}

const SynthPlaceholder = () => {
    return <Button>Add a synthesizer</Button>
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
        const { data, midiInterfaces, setData } = this.props
        const { keyboards, synthesizers, editPedal, sustainPedal } = data.setup
        const moveUp = (index) => () => {
            const elem = keyboards[index]
            const prev = keyboards[index-1]
            keyboards[index-1] = elem
            keyboards[index] = prev
            setData()
        }
        const moveDown = (index) => () => {
            const elem = keyboards[index]
            const next = keyboards[index+1]
            keyboards[index+1] = elem
            keyboards[index] = next
            setData()
        }

        return <>
            <Container title="Keyboards">
                {keyboards.map((keyboard, index) =>
                    <KeyboardConfig key={keyboard.id}
                                    keyboard={keyboard}
                                    midiInterfaces={midiInterfaces}
                                    deleteSelf={() => this.deleteKeyboard(index)}
                                    moveUp={index > 0 ? moveUp(index) : undefined}
                                    moveDown={index < keyboards.length-1 ? moveDown(index) : undefined}
                                    setData={setData}/>
                )}
                <KeyboardPlaceholder addKeyboard={() => this.addKeyboard()}/>
                <div style={styles.pedalContainer}>
                    <EditPedalConfig pedal={editPedal}/>
                    <SustainPedalConfig pedal={sustainPedal}/>
                </div>
            </Container>
            <Container title="Synthesizers">
                {synthesizers.map(synth =>
                    <SynthConfig key={synth.id}
                                 setData={setData}
                                 {...{ synth, midiInterfaces }}/>
                )}
                <SynthPlaceholder/>
            </Container>
            <MidiListener id='###SETUP_TAB###' dispatch={msg => this.handleMidi(msg)}/>
        </>
    }
    
    addKeyboard(parsedMessage) {
        const { data, setData } = this.props
        const { keyboards } = data.setup

        const midiInterface = parsedMessage ? parsedMessage.midiInterface : MidiInterfacePlaceholder
        const channel = parsedMessage ? parsedMessage.channel : 0

        keyboards.push({
            id: findId(keyboards),
            midiInterface,
            range: [21, 108],
            channel
        })
        setData()
    }

    deleteKeyboard(index) {
        const { data, setData } = this.props
        const { keyboards } = data.setup

        keyboards.splice(index, 1)
        setData()
    }

    handleMidi(parsedMessage) {
        const { data: { setup: { keyboards } } } = this.props
        const { midiInterface, channel } = parsedMessage

        if (!_.find(keyboards, { midiInterface, channel })) {
            this.addKeyboard(parsedMessage)
        }
    }
}

export default SetupTab
