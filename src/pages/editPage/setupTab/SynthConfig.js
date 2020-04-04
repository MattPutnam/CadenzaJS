import React from 'react'
import _ from 'lodash'

import ExpansionConfig from './ExpansionConfig'
import InterfaceSelector from './InterfaceSelector'
import MultiChannelSelector from './MultiChannelSelector'
import SynthSelector from './SynthSelector'

import { Container, Header, HeaderButton } from '../../../components/Container'
import Icons from '../../../components/Icons'
import { Flex } from '../../../components/Layout'


const SynthConfig = ({ synth, midiInterfaces, deleteSelf, moveUp, moveDown, data, setData }) => {
    const inUse = _.some(data.patches, { synthesizerId: synth.id })

    const synthStyle = {
        verticalAlign: 'top'
    }

    return (
        <Container alt>
            <Header>
                <InterfaceSelector hardware={synth} io='outputs' {...{ midiInterfaces, setData }}/>
                <MultiChannelSelector synth={synth} setData={setData}/>
                {moveUp && <HeaderButton icon={Icons.arrowUp} onClick={moveUp}/>}
                {moveDown && <HeaderButton icon={Icons.arrowDown} onClick={moveDown}/>}
                <HeaderButton icon={Icons.delete} disabled={inUse} onClick={deleteSelf}/>
            </Header>
            <Flex pad>
                <table>
                    <tbody>
                        <tr>
                            <td>Synthesizer</td>
                            <td>Expansions</td>
                        </tr>
                        <tr>
                            <td style={synthStyle}><SynthSelector {...{ synth, inUse, setData}}/></td>
                            <td><ExpansionConfig {...{ synth, data, setData }}/></td>
                        </tr>
                    </tbody>
                </table>
            </Flex>
        </Container>
    )
}

export default SynthConfig
