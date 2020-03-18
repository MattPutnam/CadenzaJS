import React from 'react'
import { FaArrowUp, FaArrowDown, FaTrash } from 'react-icons/fa'

import ExpansionConfig from './ExpansionConfig'
import InterfaceSelector from './InterfaceSelector'
import MultiChannelSelector from './MultiChannelSelector'
import SynthSelector from './SynthSelector'

import { Button } from '../../../components/Components'
import { Container, Flex } from '../../../components/Layout'


const SynthConfig = ({ synth, midiInterfaces, setData, deleteSelf, moveUp, moveDown }) => {
    const header = <>
        <InterfaceSelector hardware={synth}
                           io='outputs'
                           {...{ midiInterfaces, setData }}/>
        <MultiChannelSelector synth={synth} setData={setData}/>
    </>

    const buttons = [
        moveUp && <Button small key={0} onClick={moveUp}><FaArrowUp/></Button>,
        moveDown && <Button small key={1} onClick={moveDown}><FaArrowDown/></Button>,
        <Button small key={2} onClick={deleteSelf}><FaTrash/></Button>
    ]

    const synthStyle = {
        verticalAlign: 'top'
    }

    return <Container alt header={header} buttons={buttons}>
        <Flex pad>
            <table>
                <tbody>
                    <tr>
                        <td>Synthesizer</td>
                        <td>Expansions</td>
                    </tr>
                    <tr>
                        <td style={synthStyle}><SynthSelector synth={synth} setData={setData}/></td>
                        <td><ExpansionConfig synth={synth} setData={setData}/></td>
                    </tr>
                </tbody>
            </table>
            {/* <h5>Synthesizer:</h5>
            <SynthSelector synth={synth} setData={setData}/>
            <h5>Expansions:</h5>
            <ExpansionConfig synth={synth} setData={setData}/> */}
        </Flex>
    </Container>
}

export default SynthConfig
