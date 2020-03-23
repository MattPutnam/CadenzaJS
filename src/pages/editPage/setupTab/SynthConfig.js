import React from 'react'
import _ from 'lodash'
import { FaArrowUp, FaArrowDown, FaTrash } from 'react-icons/fa'

import ExpansionConfig from './ExpansionConfig'
import InterfaceSelector from './InterfaceSelector'
import MultiChannelSelector from './MultiChannelSelector'
import SynthSelector from './SynthSelector'

import { Container, Flex } from '../../../components/Layout'


const SynthConfig = ({ synth, midiInterfaces, deleteSelf, moveUp, moveDown, data, setData }) => {
    const header = <>
        <InterfaceSelector hardware={synth}
                           io='outputs'
                           {...{ midiInterfaces, setData }}/>
        <MultiChannelSelector synth={synth} setData={setData}/>
    </>

    const inUse = _.some(data.patches, { synthesizerId: synth.id })

    const buttons = [
        moveUp && { icon: FaArrowUp, onClick: moveUp },
        moveDown && { icon: FaArrowDown, onClick: moveDown },
        { icon: FaTrash, disabled: inUse, onClick: deleteSelf }
    ]

    const synthStyle = {
        verticalAlign: 'top'
    }

    return (
        <Container alt header={header} buttons={buttons}>
            <Flex pad>
                <table>
                    <tbody>
                        <tr>
                            <td>Synthesizer</td>
                            <td>Expansions</td>
                        </tr>
                        <tr>
                            <td style={synthStyle}><SynthSelector synth={synth} setData={setData}/></td>
                            <td><ExpansionConfig synth={synth} data={data} setData={setData}/></td>
                        </tr>
                    </tbody>
                </table>
            </Flex>
        </Container>
    )
}

export default SynthConfig
