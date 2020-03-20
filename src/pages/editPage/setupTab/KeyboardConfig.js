import React from 'react'
import { FaArrowUp, FaArrowDown, FaTrash } from 'react-icons/fa'

import ChannelSelector from './ChannelSelector'
import InterfaceSelector from './InterfaceSelector'
import KeyboardSizeSelector from './KeyboardSizeSelector'

import Keyboard from '../../../components/Keyboard'
import { Center, Container } from '../../../components/Layout'


const KeyboardConfig = ({ keyboard, deleteSelf, midiInterfaces, moveUp, moveDown, setData }) => {
    const header = <>
        <InterfaceSelector hardware={keyboard}
                           midiInterfaces={midiInterfaces}
                           io='inputs'
                           setData={setData}/>
        <ChannelSelector keyboard={keyboard}
                         setData={setData}/>
    </>

    const buttons = [
        moveUp && { icon: FaArrowUp, onClick: moveUp },
        moveDown && { icon: FaArrowDown, onClick: moveDown },
        { icon: FaTrash, onClick: deleteSelf }
    ]

    return <Container alt header={header} buttons={buttons}>
        <Center pad>
            <Keyboard keyboard={keyboard}/>
        </Center>
        <Center pad>
            <KeyboardSizeSelector keyboard={keyboard} setData={setData}/>
        </Center>
    </Container>
}

export default KeyboardConfig
