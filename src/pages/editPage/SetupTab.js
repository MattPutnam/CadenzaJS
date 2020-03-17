import React from 'react'
import _ from 'lodash'
import { FaPlus } from 'react-icons/fa'

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
        const { data, midiInterfaces, setData, style } = this.props
        const { keyboards, synthesizers } = data.setup
        const moveUp = (key, index) => () => {
            const obj = data.setup[key]
            const elem = obj[index]
            const prev = obj[index-1]
            obj[index-1] = elem
            obj[index] = prev
            setData()
        }
        const moveDown = (key, index) => () => {
            const obj = data.setup[key]
            const elem = obj[index]
            const next = obj[index+1]
            obj[index+1] = elem
            obj[index] = next
            setData()
        }

        const keyboardButtons = [
            <Button small key={0} onClick={() => this.addKeyboard()}><FaPlus/></Button>
        ]
        const synthButtons = [
            <Button small key={0} onClick={() => this.addSynthesizer()}><FaPlus/></Button>
        ]

        return <div style={style}>
            <Container title='Keyboards' buttons={keyboardButtons}>
                {keyboards.map((keyboard, index) =>
                    <KeyboardConfig key={keyboard.id}
                                    deleteSelf={() => this.deleteItem('keyboards', index)}
                                    moveUp={index > 0 ? moveUp('keyboards', index) : undefined}
                                    moveDown={index < keyboards.length-1 ? moveDown('keyboards', index) : undefined}
                                    {...{ keyboard, midiInterfaces, setData }}/>
                )}
                <ActionPedalConfig data={data} setData={setData}/>
            </Container>
            <Container title='Synthesizers' buttons={synthButtons}>
                {synthesizers.map((synth, index) =>
                    <SynthConfig key={synth.id}
                                 deleteSelf={() => this.deleteItem('synthesizers', index)}
                                 moveUp={index > 0 ? moveUp('synthesizers', index) : undefined}
                                 moveDown={index < synthesizers.length-1 ? moveDown('synthesizers', index) : undefined}
                                 {...{ synth, midiInterfaces, setData }}/>
                )}
            </Container>
            <MidiListener id='###SETUP_TAB###' dispatch={msg => this.handleMidi(msg)}/>
        </div>
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

    addSynthesizer() {
        const { data, setData } = this.props
        const { synthesizers } = data.setup

        synthesizers.push({
            name: 'Roland JV-1080',
            id: findId(synthesizers),
            midiInterface: MidiInterfacePlaceholder,
            expansionCards: {},
            channels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
        })
        setData()
    }

    deleteItem(key, index) {
        const { data, setData } = this.props
        data.setup[key].splice(index, 1)
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
