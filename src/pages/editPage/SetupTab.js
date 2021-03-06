import React from 'react'
import _ from 'lodash'

import ActionPedalConfig from './setupTab/ActionPedalConfig'
import { MidiInterfacePlaceholder } from './setupTab/InterfaceSelector'
import KeyboardConfig from './setupTab/KeyboardConfig'
import SynthConfig from './setupTab/SynthConfig'

import { Placeholder } from '../../components/Components'
import { Container, Header, HeaderButton, Title } from '../../components/Container'
import Icons from '../../components/Icons'
import MidiListener from '../../components/MidiListener'

import { findId } from '../../utils/IdFinder'


class SetupTab extends React.Component {
    render() {
        const { data, midiInterfaces, setData } = this.props
        const { keyboards, synthesizers } = data.setup
        const moveUp = (key, index) => () => {
            const obj = data.setup[key]
            const elem = obj[index]
            const prev = obj[index-1]
            obj[index-1] = elem
            obj[index] = prev
            setData(`move ${key === 'keyboards' ? 'keyboard' : 'synthesizer'} up`)
        }
        const moveDown = (key, index) => () => {
            const obj = data.setup[key]
            const elem = obj[index]
            const next = obj[index+1]
            obj[index+1] = elem
            obj[index] = next
            setData(`move ${key === 'keyboards' ? 'keyboard' : 'synthesizer'} down`)
        }

        return <>
            <Container collapse>
                <Header>
                    <Title>Keyboards</Title>
                    <HeaderButton icon={Icons.add} onClick={() => this.addKeyboard()}/>
                </Header>
                {_.isEmpty(keyboards) && <Placeholder height='199px'>No keyboards defined.</Placeholder>}
                {keyboards.map((keyboard, index) =>
                    <KeyboardConfig key={keyboard.id}
                                    deleteSelf={() => this.deleteItem('keyboards', index)}
                                    moveUp={index > 0 ? moveUp('keyboards', index) : undefined}
                                    moveDown={index < keyboards.length-1 ? moveDown('keyboards', index) : undefined}
                                    {...{ keyboard, midiInterfaces, data, setData }}/>
                )}
                <ActionPedalConfig data={data} setData={setData}/>
            </Container>
            <Container collapse>
                <Header>
                    <Title>Synthesizers</Title>
                    <HeaderButton icon={Icons.add} onClick={() => this.addSynthesizer()}/>
                </Header>
                {_.isEmpty(synthesizers) && <Placeholder>No synthesizers defined.</Placeholder>}
                {synthesizers.map((synth, index) => {
                    return <SynthConfig key={synth.id}
                                        deleteSelf={() => this.deleteItem('synthesizers', index)}
                                        moveUp={index > 0 ? moveUp('synthesizers', index) : undefined}
                                        moveDown={index < synthesizers.length-1 ? moveDown('synthesizers', index) : undefined}
                                        {...{ synth, midiInterfaces, data, setData }}/>
                })}
            </Container>
            <MidiListener id='SETUP_TAB' dispatch={msg => this.handleMidi(msg)}/>
        </>
    }
    
    addKeyboard(parsedMessage) {
        const { data, setData } = this.props
        const { keyboards } = data.setup

        const midiInterfaceName = parsedMessage ? parsedMessage.midiInterfaceName : MidiInterfacePlaceholder
        const channel = parsedMessage ? parsedMessage.channel : 0

        keyboards.push({
            id: findId(keyboards),
            midiInterfaceName,
            range: [21, 108],
            channel
        })
        setData('add keyboard')
    }

    addSynthesizer() {
        const { data, setData } = this.props
        const { synthesizers } = data.setup

        synthesizers.push({
            name: 'Roland JV-1080',
            id: findId(synthesizers),
            midiInterfaceName: MidiInterfacePlaceholder,
            expansionCards: {},
            channels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
        })
        setData('add synthesizer')
    }

    deleteItem(key, index) {
        const { data, setData } = this.props
        data.setup[key].splice(index, 1)
        setData(`delete ${key === 'keyboards' ? 'keyboard' : 'synthesizer'}`)
    }

    handleMidi(parsedMessage) {
        if (parsedMessage.keyboardId === undefined) {
            this.addKeyboard(parsedMessage)
        }
    }
}

export default SetupTab
