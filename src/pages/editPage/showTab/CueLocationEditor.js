import React from 'react'
import _ from 'lodash'

import { Button, Select, TextField, Warning } from '../../../components/Components'
import { Container, Flex } from '../../../components/Layout'

import { validateSongOrMeasureNumber } from '../../../utils/SongAndMeasureNumber'


class CueLocationEditor extends React.Component {
    constructor(props) {
        super(props)

        const { cueId, data } = props
        const { cues } = data.show
        const cue = _.find(cues, { id: cueId })

        this.state = {
            modified: false,
            error: undefined,
            selectedSongId: cue.songId,
            cueMeasure: cue.measure,
        }

        this.ref = React.createRef()
    }

    render() {
        const { cueId, data } = this.props
        const { songs, cues } = data.show
        const { selectedSongId, cueMeasure, modified, error } = this.state

        const cue = _.find(cues, { id: cueId })

        const sameSongAndMeasureAsUnedited = selectedSongId === cue.songId && cueMeasure === cue.measure
        const conflict = !sameSongAndMeasureAsUnedited && _.some(cues, c => c.songId === selectedSongId && c.measure === cueMeasure)

        const setCueMeasure = newMeasure => {
            const trimmed = newMeasure.trim()
            const error = validateSongOrMeasureNumber(trimmed)
            this.setState({ cueMeasure: trimmed, modified: true, error })
        }

        return (
            <Container alt>
                <Flex pad>
                    <Select ref={this.ref}
                            label='Song:'
                            options={songs}
                            render={song => `${song.number}. ${song.name}`}
                            valueRender={song => song.id}
                            selected={selectedSongId}
                            setSelected={id => this.setState({ selectedSongId: parseInt(id), modified: true })}/>
                    <TextField label='Measure:'
                               size={6}
                               value={cueMeasure}
                               setValue={setCueMeasure}/>
                    {modified && <span>- Modified</span>}
                    {error && <Warning>{error}</Warning>}
                    {conflict && <Warning>Another cue with this song/measure already exists</Warning>}
                    {modified && !error && !conflict && <Button onClick={() => this.save()}>Save</Button>}
                </Flex>
            </Container>
        )
    }

    componentDidMount() {
        this.ref.current.focus()
    }

    save() {
        const { cueId, data, setData } = this.props
        const { cues } = data.show
        const { selectedSongId, cueMeasure } = this.state

        const cue = _.find(cues, { id: cueId })
        cue.songId = selectedSongId
        cue.measure = cueMeasure
        setData('change cue location')

        this.setState({ modified: false })
    }
}

export default CueLocationEditor
