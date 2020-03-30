import React from 'react'

import { Checkbox } from '../../../components/Components'
import { Container, Flex } from '../../../components/Layout'
import Transpose from '../../../components/Transpose'


const NormalEditor = ({ patchUsage, setData }) => {
    const setMonophonic = checked => {
        if (checked) {
            patchUsage.monophonic = true
        } else {
            delete patchUsage.monophonic
        }
        setData('monophonic patch assignment')
    }

    return <>
        <Transpose alt object={patchUsage.attributes} setData={setData}/>
        <Container alt>
            <Flex pad>
                <Checkbox label='Monophonic' checked={!!patchUsage.monophonic} onChange={setMonophonic}/>
            </Flex>
        </Container>
    </>
}

export default NormalEditor