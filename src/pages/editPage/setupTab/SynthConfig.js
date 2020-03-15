import React from 'react'
import { FaArrowUp, FaArrowDown, FaTrash } from 'react-icons/fa'

import ExpansionConfig from './ExpansionConfig'
import InterfaceSelector from './InterfaceSelector'
import MultiChannelSelector from './MultiChannelSelector'
import SynthSelector from './SynthSelector'

import Button from '../../../components/Button'
import Container from '../../../components/Container'
import { Flex, Spacer } from '../../../components/Flex'


const SynthConfig = ({ synth, midiInterfaces, setData, deleteSelf, moveUp, moveDown }) => {
    return <Container inner>
        <Flex>
            <InterfaceSelector hardware={synth}
                               io='outputs'
                               {...{ midiInterfaces, setData }}/>
            <MultiChannelSelector synth={synth} setData={setData}/>
            <Spacer/>
            {moveUp && <Button onClick={moveUp} iconButton><FaArrowUp/></Button>}
            {moveDown && <Button onClick={moveDown} iconButton><FaArrowDown/></Button>}
            <Button onClick={deleteSelf} iconButton><FaTrash/></Button>
        </Flex>
        <h5>Synthesizer:</h5>
        <SynthSelector synth={synth} setData={setData}/>
        <h5>Expansions:</h5>
        <ExpansionConfig synth={synth} setData={setData}/>
    </Container>
}

export default SynthConfig
