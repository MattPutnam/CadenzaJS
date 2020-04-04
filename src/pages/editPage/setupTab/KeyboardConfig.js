import React from 'react'
import _ from 'lodash'

import ChannelSelector from './ChannelSelector'
import InterfaceSelector from './InterfaceSelector'
import KeyboardSizeSelector from './KeyboardSizeSelector'

import { Container, Header, HeaderButton } from '../../../components/Container'
import Icons from '../../../components/Icons'
import Keyboard from '../../../components/Keyboard'
import { Center } from '../../../components/Layout'


const KeyboardConfig = ({ keyboard, deleteSelf, midiInterfaces, moveUp, moveDown, data, setData }) => {
    const deleteDisabled = _.some(data.show.cues, cue => {
        return _.some(cue.patchUsages, patchUsage => {
            return patchUsage.keyboardId === keyboard.id
        })
    })

    return (
        <Container alt>
            <Header>
                <InterfaceSelector hardware={keyboard}
                                   midiInterfaces={midiInterfaces}
                                   io='inputs'
                                   setData={setData}/>
                <ChannelSelector keyboard={keyboard}
                                 setData={setData}/>
                {moveUp && <HeaderButton icon={Icons.arrowUp} onClick={moveUp}/>}
                {moveDown && <HeaderButton icon={Icons.arrowDown} onClick={moveDown}/>}
                <HeaderButton icon={Icons.delete} disabled={deleteDisabled} onClick={deleteSelf}/>
            </Header>
            <Center pad>
                <Keyboard keyboard={keyboard}/>
            </Center>
            <Center pad>
                <KeyboardSizeSelector keyboard={keyboard} setData={setData}/>
            </Center>
        </Container>
    )
}

export default KeyboardConfig
