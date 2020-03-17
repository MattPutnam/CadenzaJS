import React from 'react'
import { FaArrowUp, FaArrowDown, FaTrash } from 'react-icons/fa'

import ExpansionConfig from './ExpansionConfig'
import InterfaceSelector from './InterfaceSelector'
import MultiChannelSelector from './MultiChannelSelector'
import SynthSelector from './SynthSelector'

import Container, { ContainerButton } from '../../../components/Container'
import { Flex } from '../../../components/Flex'


const SynthConfig = ({ synth, midiInterfaces, setData, deleteSelf, moveUp, moveDown }) => {
    const header = <>
        <InterfaceSelector hardware={synth}
                           io='outputs'
                           {...{ midiInterfaces, setData }}/>
        <MultiChannelSelector synth={synth} setData={setData}/>
    </>

    const buttons = [
        moveUp && <ContainerButton key={0} onClick={moveUp}><FaArrowUp/></ContainerButton>,
        moveDown && <ContainerButton key={1} onClick={moveDown}><FaArrowDown/></ContainerButton>,
        <ContainerButton key={2} onClick={deleteSelf}><FaTrash/></ContainerButton>
    ]

    return <Container inner title={header} buttons={buttons}>
        <Flex column pad>
            <h5>Synthesizer:</h5>
            <SynthSelector synth={synth} setData={setData}/>
            <h5>Expansions:</h5>
            <ExpansionConfig synth={synth} setData={setData}/>
        </Flex>
    </Container>
}

export default SynthConfig
