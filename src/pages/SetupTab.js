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
import * as Midi from '../utils/Midi'


const KeyboardConfig = ({ keyboard, deleteSelf, midiInterfaces, moveUp, moveDown, setData }) => {
    return <Container inner>
        <Flex>
            <InterfaceSelector hardware={keyboard}
                               midiInterfaces={midiInterfaces}
                               io='inputs'
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

const SynthConfig = ({ synth, midiInterfaces, setData }) => {
    return <Container inner>
        <SynthSelector selected={synth.name}/>
        <InterfaceSelector hardware={synth}
                           midiInterfaces={midiInterfaces}
                           io='outputs'
                           setData={setData}/>
    </Container>
}

class ActionPedalConfig extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            stage: undefined,
            stage1Signals: [],
            stage2Signals: []
        }
    }
    render() {
        return <Container inner title='Action Pedal'>
            {this.getDisplay()}
        </Container>
    }

    getDisplay() {
        const { pedal, keyboards } = this.props

        if (!pedal) {
            return 'Not set up'
        }
        if (keyboards.length === 0) {
            return 'No keyboards available'
        }

        const { keyboardId, control, type } = pedal
        const keyboard = _.find(keyboards, { id: keyboardId })

        if (!keyboard) {
            return 'Keyboard not found'
        }

        const styles = {
            labelColumn: {
                textAlign: 'right'
            }
        }

        return <table>
        <tbody>
            {keyboards.length > 1 && <tr>
                <td style={styles.labelColumn}>Keyboard:</td>
                <td>{keyboard.midiInterface} on channel {keyboard.channel+1}</td>
            </tr>}
            <tr>
                <td style={styles.labelColumn}>Controller:</td>
                <td>{Midi.ccNames[control].long}</td>
            </tr>
            <tr>
                <td style={styles.labelColumn}>Type:</td>
                <td>{type}</td>
            </tr>
        </tbody>
    </table>
    }
}


class SetupTab extends React.Component {
    render() {
        const { data, midiInterfaces, setData } = this.props
        const { keyboards, synthesizers, actionPedal } = data.setup
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
            <Container title='Keyboards'>
                {keyboards.map((keyboard, index) =>
                    <KeyboardConfig key={keyboard.id}
                                    keyboard={keyboard}
                                    midiInterfaces={midiInterfaces}
                                    deleteSelf={() => this.deleteKeyboard(index)}
                                    moveUp={index > 0 ? moveUp(index) : undefined}
                                    moveDown={index < keyboards.length-1 ? moveDown(index) : undefined}
                                    setData={setData}/>
                )}
                <Button onClick={() => this.addKeyboard()}>
                    Add a keyboard, or press a key to auto discover
                </Button>
                <ActionPedalConfig pedal={actionPedal} keyboards={keyboards}/>
            </Container>
            <Container title='Synthesizers'>
                {synthesizers.map(synth =>
                    <SynthConfig key={synth.id}
                                 setData={setData}
                                 {...{ synth, midiInterfaces }}/>
                )}
                <Button>Add a synthesizer</Button>
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
