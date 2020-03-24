import React from 'react'
import _ from 'lodash'
import { FaArrowUp, FaArrowDown, FaTrash } from 'react-icons/fa'

import ChannelSelector from './ChannelSelector'
import InterfaceSelector from './InterfaceSelector'
import KeyboardSizeSelector from './KeyboardSizeSelector'

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

    const deleteDisabled = _.some(data.show.songs, song => {
        return _.some(song.cues, cue => {
            return _.some(cue.patchUsages, patchUsage => {
                return patchUsage.keyboardId === keyboard.id
            })
        })
    })

    const buttons = [
        moveUp && { icon: FaArrowUp, onClick: moveUp },
        moveDown && { icon: FaArrowDown, onClick: moveDown },
        { icon: FaTrash, disabled: deleteDisabled, onClick: deleteSelf }
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
