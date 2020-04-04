import React from 'react'

import { Container, Header, Title } from '../../../components/Container'
import ControlMapper from '../../../components/ControlMapper'
import Transpose from '../../../components/Transpose'
import TriggerEditor from '../../../components/TriggerEditor'


const GlobalsEditor = ({ data, setData}) => {
    return (
        <Container>
            <Header>
                <Title>Edit global settings</Title>
            </Header>
            <Transpose alt object={data.show} setData={setData}/>
            <TriggerEditor object={data.show} data={data} setData={setData}/>
            <ControlMapper alt object={data.show} setData={setData}/>
        </Container>
    )
}

export default GlobalsEditor
