import React from 'react'

import ExpansionConfig from './ExpansionConfig'
import InterfaceSelector from './InterfaceSelector'
import MultiChannelSelector from './MultiChannelSelector'
import SynthSelector from './SynthSelector'

import Container from '../../../components/Container'
import { Flex } from '../../../components/Flex'


const SynthConfig = ({ synth, midiInterfaces, setData }) => {
    return <Container inner>
        <Flex>
            <InterfaceSelector hardware={synth}
                               io='outputs'
                               {...{ midiInterfaces, setData }}/>
            <MultiChannelSelector synth={synth} setData={setData}/>
        </Flex>
        <h5>Synthesizer:</h5>
        <SynthSelector synth={synth} setData={setData}/>
        <h5>Expansions:</h5>
        <ExpansionConfig synth={synth} setData={setData}/>
    </Container>
}

export default SynthConfig
