import React from 'react'
import _ from 'lodash'
import { FaTrash } from 'react-icons/fa'

import PatchUsageDisplay from './PatchUsageDisplay'
import PatchUsageEditor from './PatchUsageEditor'

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
            cueMeasure: cue.measure,
            selectedPatchUsage: undefined
        }

        this.ref = React.createRef()
    }

    render() {
        const { song, cue, deleteSelf, data, setData } = this.props
        const { songs } = data.show
        const { selectedSong, cueMeasure, selectedPatchUsage, modified, error } = this.state

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

        const deleteSelectedPatchUsage = () => {
            _.remove(cue.patchUsages, selectedPatchUsage)
            setData()
            this.setState({ selectedPatchUsage: undefined })
        }

        const postHeader = <>
            {modified && <span>&nbsp;- Modified</span>}
            {error && <Warning>{error}</Warning>}
            {conflict && <Warning>Another cue with this song/measure already exists</Warning>}
            {modified && !error && !conflict && <Button onClick={() => this.save()}>Save</Button>}
        </>

        const buttons = [{ icon: FaTrash, onClick: deleteSelf }]

        return (
            <Container header='Edit Cue' postHeader={postHeader} buttons={buttons}>
                <Container alt>
                    <Flex pad>
                        <Select ref={this.ref}
                                label='Song:'
                                options={songs.map(songToString)}
                                selected={songToString(selectedSong)}
                                setSelected={setSong}/>
                        <TextField label='Measure:'
                                   size={6}
                                   value={cueMeasure}
                                   setValue={setCueMeasure}/>
                    </Flex>
                </Container>
                <PatchUsageDisplay key={JSON.stringify(cue.patchUsages)}
                                   setSelectedPatchUsage={selected => this.setState({ selectedPatchUsage: selected })}
                                   {...{ cue, data, setData, selectedPatchUsage }}/>
                {selectedPatchUsage && <PatchUsageEditor patchUsage={selectedPatchUsage}
                                                         deleteSelf={deleteSelectedPatchUsage}
                                                         {...{ data, setData }}/>}
            </Container>
        )
    }

    componentDidMount() {
        this.ref.current.focus()
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
