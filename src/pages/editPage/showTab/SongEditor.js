import React from 'react'
import _ from 'lodash'

import Icons from '../../../components/Icons'
import { Container } from '../../../components/Layout'
import SongLocationEditor from './SongLocationEditor'
import Transpose from '../../../components/Transpose'
import TriggerEditor from '../../../components/TriggerEditor'


const SongEditor = ({ songId, deleteSelf, data, setData }) => {
    const { songs } = data.show
    const song = _.find(songs, { id: songId })

    const buttons = [{ icon: Icons.delete, onClick: deleteSelf }]

    return (
        <Container header='Edit song' buttons={buttons}>
            <SongLocationEditor key={song.number} {...{ songId, data, setData }}/>
            <Transpose alt object={song} setData={setData}/>
            <TriggerEditor object={song} data={data} setData={setData}/>
        </Container>
    )
}

export default SongEditor
