import React from 'react'
import { FaArrowUp, FaArrowDown, FaTrash } from 'react-icons/fa'

import ChannelSelector from './ChannelSelector'
import InterfaceSelector from './InterfaceSelector'
import KeyboardSizeSelector from './KeyboardSizeSelector'

import Container, { ContainerButton } from '../../../components/Container'
import { Center } from '../../../components/Flex'
import Keyboard from '../../../components/Keyboard'


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
        moveUp && <ContainerButton key={0} onClick={moveUp}><FaArrowUp/></ContainerButton>,
        moveDown && <ContainerButton key={1} onClick={moveDown}><FaArrowDown/></ContainerButton>,
        <ContainerButton key={2} onClick={deleteSelf}><FaTrash/></ContainerButton>
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
