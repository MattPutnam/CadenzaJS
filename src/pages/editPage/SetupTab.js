import React from 'react'
import _ from 'lodash'

import ActionPedalConfig from './setupTab/ActionPedalConfig'
import { MidiInterfacePlaceholder } from './setupTab/InterfaceSelector'
import KeyboardConfig from './setupTab/KeyboardConfig'
import SynthConfig from './setupTab/SynthConfig'

import Button from '../../components/Button'
import Container from '../../components/Container'
import MidiListener from '../../components/MidiListener'

import { findId } from '../../utils/IdFinder'


class SetupTab extends React.Component {
    render() {
        const { data, midiInterfaces, setData } = this.props
        const { keyboards, synthesizers } = data.setup
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
                                    deleteSelf={() => this.deleteKeyboard(index)}
                                    moveUp={index > 0 ? moveUp(index) : undefined}
                                    moveDown={index < keyboards.length-1 ? moveDown(index) : undefined}
                                    {...{ keyboard, midiInterfaces, setData }}/>
                )}
                <Button onClick={() => this.addKeyboard()}>
                    Add a keyboard, or press a key to auto discover
                </Button>
                <ActionPedalConfig data={data} setData={setData}/>
            </Container>
            <Container title='Synthesizers'>
                {synthesizers.map(synth =>
                    <SynthConfig key={synth.id}
                                 {...{ synth, midiInterfaces, setData }}/>
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
