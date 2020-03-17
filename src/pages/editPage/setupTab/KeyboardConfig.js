import React from 'react'
import { FaArrowUp, FaArrowDown, FaTrash } from 'react-icons/fa'

import ChannelSelector from './ChannelSelector'
import InterfaceSelector from './InterfaceSelector'
import KeyboardSizeSelector from './KeyboardSizeSelector'

import Button from '../../../components/Button'
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
        moveUp && <Button small key={0} onClick={moveUp}><FaArrowUp/></Button>,
        moveDown && <Button small key={1} onClick={moveDown}><FaArrowDown/></Button>,
        <Button small key={2} onClick={deleteSelf}><FaTrash/></Button>
    ]

    return <Container inner title={header} buttons={buttons}>
        <Center pad>
            <Keyboard keyboard={keyboard}/>
        </Center>
        <Center pad>
            <KeyboardSizeSelector keyboard={keyboard} setData={setData}/>
        </Center>
    </Container>
}

export default KeyboardConfig
