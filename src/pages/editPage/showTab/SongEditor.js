import React from 'react'
import _ from 'lodash'

import { Container, Header, HeaderButton, Title } from '../../../components/Container'
import ControlMapper from '../../../components/ControlMapper'
import Icons from '../../../components/Icons'
import SongLocationEditor from './SongLocationEditor'
import Transpose from '../../../components/Transpose'
import TriggerEditor from '../../../components/TriggerEditor'


const SongEditor = ({ songId, cloneSelf, deleteSelf, data, setData }) => {
    const { songs } = data.show
    const song = _.find(songs, { id: songId })

    return (
        <Container>
            <Header>
                <Title>Edit song</Title>
                <HeaderButton icon={Icons.clone} onClick={cloneSelf}/>
                <HeaderButton icon={Icons.delete} onClick={deleteSelf}/>
            </Header>
            <SongLocationEditor key={song.number} {...{ songId, data, setData }}/>
            <Transpose alt object={song} setData={setData}/>
            <TriggerEditor object={song} data={data} setData={setData}/>
            <ControlMapper alt object={song} setData={setData}/>
        </Container>
    )
}

export default SongEditor
