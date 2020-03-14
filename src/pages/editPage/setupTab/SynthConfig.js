import React from 'react'

import Container from '../../../components/Container'
import InterfaceSelector from '../../../components/InterfaceSelector'
import SynthSelector from '../../../components/SynthSelector'

const SynthConfig = ({ synth, midiInterfaces, setData }) => {
    return <Container inner>
        <SynthSelector selected={synth.name}/>
        <InterfaceSelector hardware={synth}
                           midiInterfaces={midiInterfaces}
                           io='outputs'
                           setData={setData}/>
    </Container>
}

export default SynthConfig
