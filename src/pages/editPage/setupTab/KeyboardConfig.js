import React from 'react'
import { FaArrowUp, FaArrowDown, FaTrash } from 'react-icons/fa'

import ChannelSelector from './ChannelSelector'
import InterfaceSelector from './InterfaceSelector'
import KeyboardSizeSelector from './KeyboardSizeSelector'

import Button from '../../../components/Button'
import Container from '../../../components/Container'
import { Center, Flex, Spacer } from '../../../components/Flex'
import Keyboard from '../../../components/Keyboard'


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

export default KeyboardConfig
