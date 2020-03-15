import React from 'react'

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
        
        <SynthSelector selected={synth.name}/>
        
    </Container>
}

export default SynthConfig
