import React from 'react'
import _ from 'lodash'

import { Button, Select, TextField, Warning } from '../../../components/Components'
import { Container, Flex } from '../../../components/Layout'

import { cueCompare, validateSongOrMeasureNumber } from '../../../utils/SongAndMeasureNumber'


class CueEditor extends React.Component {
    constructor(props) {
        super(props)

        const { song, cue } = this.props

        this.state = {
            modified: false,
            error: undefined,
            selectedSong: song,
            cueMeasure: cue.measure
        }
    }

    render() {
        const { song, cue, data } = this.props
        const { songs } = data.show
        const { selectedSong, cueMeasure, modified, error } = this.state

        const songToString = song => `${song.number}. ${song.name}`
        const songFromString = str => {
            const number = str.substring(0, str.indexOf('.'))
            return _.find(songs, { number })
        }

        const setSong = newSong => {
            this.setState({ selectedSong: songFromString(newSong), modified: true })
        }

        const setCueMeasure = newMeasure => {
            const trimmed = newMeasure.trim()
            const error = validateSongOrMeasureNumber(trimmed)
            this.setState({ cueMeasure: trimmed, modified: true, error })
        }

        const sameSongAndMeasureAsUnedited = selectedSong === song && cueMeasure === cue.measure
        const conflict = !sameSongAndMeasureAsUnedited && _.some(selectedSong.cues, c => c.measure.toLowerCase() === cueMeasure)

        const postHeader = <>
            {modified && <span>&nbsp;- Modified</span>}
            {error && <Warning>{error}</Warning>}
            {conflict && <Warning>Another cue with this song/measure already exists</Warning>}
            {modified && !error && !conflict && <Button onClick={() => this.save()}>Save</Button>}
        </>

        return <Container header='Edit Cue' postHeader={postHeader}>
            <Container alt>
                <Flex pad>
                    <Select label='Song:'
                            options={songs.map(songToString)}
                            selected={songToString(selectedSong)}
                            setSelected={setSong}/>
                    <TextField label='Measure:'
                               size={6}
                               value={cueMeasure}
                               setValue={setCueMeasure}/>
                </Flex>
            </Container>
        </Container>
    }

    save() {
        const { song, cue, setData, setParentSong } = this.props
        const { selectedSong, cueMeasure } = this.state

        cue.measure = cueMeasure
        if (selectedSong !== song) {
            _.remove(song.cues, { measure: cue.measure })
            selectedSong.cues.push(cue)
            selectedSong.cues.sort(cueCompare)
            setParentSong(selectedSong)
        }
        setData()

        this.setState({ modified: false })
    }
}

export default CueEditor
