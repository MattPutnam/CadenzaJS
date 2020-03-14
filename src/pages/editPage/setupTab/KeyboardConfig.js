import React from 'react'
import { FaArrowUp, FaArrowDown, FaTrash } from 'react-icons/fa'

import Button from '../../../components/Button'
import ChannelSelector from '../../../components/ChannelSelector'
import Container from '../../../components/Container'
import { Center, Flex, Spacer } from '../../../components/Flex'
import InterfaceSelector from '../../../components/InterfaceSelector'
import Keyboard from '../../../components/Keyboard'
import KeyboardSizeSelector from '../../../components/KeyboardSizeSelector'

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
