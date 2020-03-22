import React from 'react'
import _ from 'lodash'
import { FaTrash } from 'react-icons/fa'

import { Button, Select, TextField, Warning } from '../../../components/Components'
import Keyboard from '../../../components/Keyboard'
import { Center, Container, Flex } from '../../../components/Layout'

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

        this.ref = React.createRef()
    }

    render() {
        const { song, cue, deleteSelf, data } = this.props
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

        const buttons = [
            { icon: FaTrash, onClick: deleteSelf }
        ]

        return <Container header='Edit Cue' postHeader={postHeader} buttons={buttons}>
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
            <PatchUsageDisplay key={JSON.stringify(cue.patchUsages)} cue={cue} data={data}></PatchUsageDisplay>
        </Container>
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


class PatchUsageDisplay extends React.Component {
    constructor(props) {
        super(props)

        const { data, cue } = props
        const { keyboards } = data.setup

        this.keyboardRefs = {}
        _.forEach(keyboards, k => {
            this.keyboardRefs[k.id] = React.createRef()
        })

        this.patchUsageRefs = []
        for (let i = 0; i < cue.patchUsages.length; ++i) {
            this.patchUsageRefs.push(React.createRef())
        }
    }

    render() {
        const { cue, data } = this.props
        const { keyboards } = data.setup

        const styles = {
            patchUsage: {
                display: 'relative',
                alignSelf: 'stretch',
                padding: '0.25rem 0.5rem',
                border: '1px solid black',
                textAlign: 'center',
                backgroundColor: 'white',
                color: 'black',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                cursor: 'pointer'
            }
        }
    
        const patchUsagesByKeyboardId = _.groupBy(cue.patchUsages, 'keyboardId')
    
        return <Container alt header='Drag a range of notes to add a patch'>
            {keyboards.map(keyboard => {
                const patchUsages = patchUsagesByKeyboardId[keyboard.id] || []
                return <Center pad key={keyboard.id}>
                    <Flex column>
                        <Keyboard ref={this.keyboardRefs[keyboard.id]} keyboard={keyboard}/>
                        {patchUsages.map((patchUsage, index) => {
                        const { patchId } = patchUsage
                        const patch = _.find(data.patches, { id: patchId })
                        return <div key={index} ref={this.patchUsageRefs[index]} style={styles.patchUsage}>
                            {patch.name}
                        </div>
                    })}
                    </Flex>
                </Center>
            })}
        </Container>
    }

    componentDidMount() {
        const { cue } = this.props

        for (let i = 0; i < cue.patchUsages.length; ++i) {
            const patchUsage = cue.patchUsages[i]

            const patchUsageDOM = this.patchUsageRefs[i].current
            const keyboardDOM = this.keyboardRefs[patchUsage.keyboardId].current

            const { lowNote, highNote } = patchUsage
            if (lowNote && highNote) {
                const { left } = keyboardDOM.getBounds(lowNote)
                const { right } = keyboardDOM.getBounds(highNote)
                patchUsageDOM.style.marginLeft = `${left}.px`
                patchUsageDOM.style.width = `${right - left + 1}px`
            } else if (lowNote) {
                const { left } = keyboardDOM.getBounds(lowNote)
                patchUsageDOM.style.marginLeft = `${left}px`
            } else if (highNote) {
                const { right } = keyboardDOM.getBounds(highNote)
                patchUsageDOM.style.width = `${right}px`
            }
        }
    }
}
