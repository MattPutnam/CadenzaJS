import React from 'react'

import ControlMapper from '../../../components/ControlMapper'
import { Container } from '../../../components/Layout'
import Transpose from '../../../components/Transpose'
import TriggerEditor from '../../../components/TriggerEditor'


const GlobalsEditor = ({ data, setData}) => {
    return (
        <Container header='Edit global settings'>
            <Transpose alt object={data.show} setData={setData}/>
            <TriggerEditor object={data.show} data={data} setData={setData}/>
            <ControlMapper alt object={data.show} setData={setData}/>
        </Container>
    )
}

export default GlobalsEditor
