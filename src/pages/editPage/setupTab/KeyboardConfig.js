import React from 'react'
import _ from 'lodash'

import ChannelSelector from './ChannelSelector'
import InterfaceSelector from './InterfaceSelector'
import KeyboardSizeSelector from './KeyboardSizeSelector'

import Icons from '../../../components/Icons'
import Keyboard from '../../../components/Keyboard'
import { Center, Container } from '../../../components/Layout'


const KeyboardConfig = ({ keyboard, deleteSelf, midiInterfaces, moveUp, moveDown, data, setData }) => {
    const header = <>
        <InterfaceSelector hardware={keyboard}
                           midiInterfaces={midiInterfaces}
                           io='inputs'
                           setData={setData}/>
        <ChannelSelector keyboard={keyboard}
                         setData={setData}/>
    </>

    const deleteDisabled = _.some(data.show.cues, cue => {
        return _.some(cue.patchUsages, patchUsage => {
            return patchUsage.keyboardId === keyboard.id
        })
    })

    const buttons = [
        moveUp && { icon: Icons.arrowUp, onClick: moveUp },
        moveDown && { icon: Icons.arrowDown, onClick: moveDown },
        { icon: Icons.delete, disabled: deleteDisabled, onClick: deleteSelf }
    ]

    return (
        <Container alt header={header} buttons={buttons}>
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
