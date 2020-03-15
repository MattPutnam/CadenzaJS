import React from 'react'

import Container from '../../../components/Container'
import { Flex } from '../../../components/Flex'
import InterfaceSelector from '../../../components/InterfaceSelector'
import MultiChannelSelector from '../../../components/MultiChannelSelector'
import SynthSelector from '../../../components/SynthSelector'


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
