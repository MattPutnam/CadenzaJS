import React from 'react'
import _ from 'lodash'

import CueEditor from './showTab/CueEditor'
import SongEditor from './showTab/SongEditor'

import Colors from '../../components/Colors'
import { Placeholder, ButtonLike } from '../../components/Components'
import Icons, { icon } from '../../components/Icons'
import { Container, Flex } from '../../components/Layout'

import { findId } from '../../utils/IdFinder'
import { cueCompare, songCompare, generateNext } from '../../utils/SongAndMeasureNumber'


class ShowTab extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            collapsedSongs: new Set(),
            selectedSongId: undefined,
            selectedCueId: undefined
        }
    }

    render() {
        const style = {
            flex: '1 1 auto',
            overflow: 'hidden'
        }
    
        return (
            <Flex align='stretch' style={style}>
                {this.cuesList()}
                {this.editPane()}
            </Flex>
        )
    }

    componentDidUpdate() {
        // If we undo/redo and the selected cue/song doesn't exist, unselect
        const { data } = this.props
        const { songs, cues } = data.show
        const { selectedSongId, selectedCueId } = this.state

        if (selectedSongId !== undefined && !_.find(songs, { id: selectedSongId })) {
            this.setState({ selectedSongId: undefined })
        } else if (selectedCueId !== undefined && !_.find(cues, { id: selectedCueId })) {
            this.setState({ selectedCueId: undefined })
        }
    }

    cuesList() {
        const { data } = this.props
        const { songs, cues } = data.show

        const { collapsedSongs, selectedSongId, selectedCueId } = this.state

        const styles = {
            list: {
                alignSelf: 'stretch',
                overflowY: 'auto'
            },
            song: selected => ({
                alignSelf: 'stretch',
                margin: '3px 0',
                fontWeight: selected ? 'bold' : undefined,
                backgroundColor: selected ? Colors.blue[2] : Colors.gray[1],
                cursor: 'pointer'
            }),
            songCaret: {
                flex: 'none',
                margin: '0 0.25rem'
            },
            songTitle: {
                flex: '1 1 auto',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
            },
            cue: selected => ({
                alignSelf: 'stretch',
                margin: '3px 0',
                fontWeight: selected ? 'bold' : undefined,
                backgroundColor: selected ? Colors.blue[2] : undefined,
                paddingLeft: '0.5rem',
                cursor: 'pointer'
            })
        }

        const toggleSongCollapse = (id, collapsed) => {
            if (collapsed) {
                collapsedSongs.delete(id)
            } else {
                collapsedSongs.add(id)
            }
            this.setState({ collapsedSongs })
        }

        const keyCollapse = id => e => {
            if (e.key === 'ArrowRight') {
                toggleSongCollapse(id, false)
            } else if (e.key === 'ArrowLeft') {
                toggleSongCollapse(id, true)
            }
        }

        const buttons = [
            { icon: Icons.addSong, disabled: _.isEmpty(data.setup.synthesizers), onClick: () => this.addSong() },
            { icon: Icons.add, disabled: _.isEmpty(songs), onClick: () => this.addCue() }
        ]

        return (
            <Container header='Cues' flex='0 0 200px' buttons={buttons}>
                <div style={styles.list}>
                    {songs.sort(songCompare).map(song => {
                        const { number, name } = song
                        const collapsed = collapsedSongs.has(song.id)
                        const songSelected = song.id === selectedSongId
                        const caretProps = {
                            style: styles.songCaret,
                            onClick: () => toggleSongCollapse(song.id, collapsed)
                        }

                        const songCues = _.filter(cues, { songId: song.id }).sort(cueCompare)

                        return (
                            <React.Fragment key={`Song#${song.id}`}>
                                <Flex element={ButtonLike}
                                      align='center'
                                      style={styles.song(songSelected)}
                                      onKeyDown={keyCollapse(song.id)}
                                      onClick={() => this.setState({ selectedSongId: song.id, selectedCueId: undefined })}>
                                    {collapsed ? icon(Icons.collapsed, caretProps) : icon(Icons.expanded, caretProps)}
                                    <span style={styles.songTitle}>
                                        {number}: {name}
                                    </span>
                                </Flex>
                                {!collapsed && songCues.map(cue => {
                                    const { measure } = cue
                                    const cueSelected = cue.id === selectedCueId

                                    return (
                                        <ButtonLike key={`Song#${song.id}Cue#${cue.id}`}
                                                    style={styles.cue(cueSelected)}
                                                    onClick={() => this.setState({ selectedSongId: undefined, selectedCueId: cue.id })}>
                                            m. {measure}
                                        </ButtonLike>
                                    )
                                })}
                            </React.Fragment>
                        )
                    })}
                </div>
            </Container>
        )
    }

    editPane() {
        const { data, setData } = this.props
        const { songs, cues } = data.show
        const { selectedSongId, selectedCueId } = this.state

        const foundSong = selectedSongId !== undefined && _.some(songs, { id: selectedSongId })
        const foundCue = selectedCueId !== undefined && _.some(cues, { id: selectedCueId })

        if (foundCue) {
            return <CueEditor key={selectedCueId}
                              cueId={selectedCueId}
                              deleteSelf={() => this.deleteCue()}
                              {...{ data, setData }}/>
        } else if (foundSong) {
            return <SongEditor key={selectedSongId}
                               songId={selectedSongId}
                               deleteSelf={() => this.deleteSong()}
                               {...{ data, setData }}/>
        } else if (_.isEmpty(data.setup.synthesizers)) {
            return <Placeholder>No synthesizers defined. Go to the Setup tab.</Placeholder>
        } else {
            return <Placeholder>Select a song or cue to edit it</Placeholder>
        }
    }

    addSong() {
        const { data, setData } = this.props
        const { songs, cues } = data.show
        const { selectedSongId, selectedCueId } = this.state

        let newNumber
        if (_.isEmpty(songs)) {
            newNumber = "1"
        } else if (selectedSongId !== undefined) {
            // a song is selected, insert after
            const song = _.find(songs, { id: selectedSongId })
            newNumber = generateNext(song.number, songs.map(s => s.number))
        } else if (selectedCueId !== undefined) {
            // a cue is selected, insert after its song
            const cue = _.find(cues, { id: selectedCueId })
            const song = _.find(songs, { id: cue.songId })
            newNumber = generateNext(song.number, songs.map(s => s.number))
        } else {
            // nothing is selected, add to the end
            newNumber = generateNext(_.last(songs).number)
        }

        const id = findId(songs)
        const newSong = {
            id,
            number: newNumber,
            name: '',
        }
        songs.push(newSong)
        setData('add song')
        this.setState({ selectedSongId: id, selectedCueIndex: undefined })
    }

    deleteSong() {
        const { data, setData } = this.props
        const { songs } = data.show
        const { selectedSongId } = this.state

        _.remove(songs, { id: selectedSongId })
        setData('delete song')
        this.setState({ selectedSongId: undefined, selectedCueId: undefined })
    }

    addCue() {
        const { data, setData } = this.props
        const { songs, cues } = data.show
        const { selectedSongId, selectedCueId } = this.state

        let songId
        let newNumber
        if (selectedSongId !== undefined) {
            // a song is selected, add to the end of the song
            const songCues = _.filter(cues, { songId: selectedSongId }).sort(cueCompare)
            songId = selectedSongId
            newNumber = generateNext(_.last(songCues).measure)
        } else if (selectedCueId !== undefined) {
            // a cue is selected, insert after
            const cue = _.find(cues, { id: selectedCueId })
            const song = _.find(songs, { id: cue.songId })
            const songCues = _.filter(cues, { songId: song.id }).sort(cueCompare)
            songId = song.id
            newNumber = generateNext(cue.measure, songCues.map(c => c.measure))
        } else {
            // nothing is selected, add to the end of the last song
            const song = _.last(songs)
            const songCues = _.filter(cues, { songId: song.id }).sort(cueCompare)
            songId = song.id
            newNumber = generateNext(_.last(songCues).measure)
        }

        const id = findId(cues)
        const newCue = {
            id,
            songId,
            measure: newNumber,
            patchUsages: []
        }
        cues.push(newCue)
        setData('add cue')
        this.setState({ selectedCueId: id, selectedSongId: undefined })
    }

    deleteCue() {
        const { data, setData } = this.props
        const { cues } = data.show
        const { selectedCueId } = this.state

        _.remove(cues, { id: selectedCueId })
        setData('delete cue')
        this.setState({ selectedSongId: undefined, selectedCueId: undefined })
    }
}

export default ShowTab
