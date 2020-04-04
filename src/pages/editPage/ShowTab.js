import React from 'react'
import _ from 'lodash'

import CueEditor from './showTab/CueEditor'
import SongEditor from './showTab/SongEditor'

import { Placeholder } from '../../components/Components'
import Icons from '../../components/Icons'
import { Container, Flex } from '../../components/Layout'
import { List, ListItem, ListSection } from '../../components/List'

import { findId } from '../../utils/IdFinder'
import { cueCompare, songCompare, generateNext } from '../../utils/SongAndMeasureNumber'
import GlobalsEditor from './showTab/GlobalsEditor'


class ShowTab extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            selectedId: undefined
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

        const { selectedId } = this.state
        const { songId, cueId } = selectedId || {}

        if ((songId !== undefined && !_.find(songs, { id: songId })) ||
            (cueId !== undefined && !_.find(cues, { id: cueId }))) {
            this.setState({ selectedId: undefined })
        }
    }

    cuesList() {
        const { data } = this.props
        const { songs, cues } = data.show

        const { selectedId } = this.state

        const buttons = [
            { icon: Icons.addSong, disabled: _.isEmpty(data.setup.synthesizers), onClick: () => this.addSong() },
            { icon: Icons.add, disabled: _.isEmpty(songs), onClick: () => this.addCue() }
        ]

        return (
            <Container header='Cues' flex='0 0 200px' buttons={buttons}>
                <List selectedItem={selectedId} setSelectedItem={id => this.setState({ selectedId: id })}>
                    <ListItem value={{ globals: true }}>Global settings</ListItem>
                    {songs.sort(songCompare).map((song, songIndex) => {
                        const { number, name } = song
                        const songCues = _.filter(cues, { songId: song.id }).sort(cueCompare)

                        return (
                            <ListSection key={songIndex} title={`${number}: ${name}`} value={{ songId: song.id }}>
                                {songCues.map((cue, cueIndex) => {
                                    return (
                                        <ListItem key={cueIndex} value={{ cueId: cue.id }}>
                                            {`m. ${cue.measure}`}
                                        </ListItem>
                                    )
                                })}
                            </ListSection>
                        )
                    })}
                </List>
            </Container>
        )
    }

    editPane() {
        const { data, setData } = this.props
        const { songs, cues } = data.show

        const { selectedId } = this.state
        const { songId, cueId, globals } = selectedId || {}

        const foundSong = songId !== undefined && _.some(songs, { id: songId })
        const foundCue = cueId !== undefined && _.some(cues, { id: cueId })

        if (globals) {
            return <GlobalsEditor {...{ data, setData }}/>
        } else if (foundCue) {
            return <CueEditor key={cueId}
                              deleteSelf={() => this.deleteCue()}
                              {...{ cueId, data, setData }}/>
        } else if (foundSong) {
            return <SongEditor key={songId}
                               deleteSelf={() => this.deleteSong()}
                               {...{ songId, data, setData }}/>
        } else if (_.isEmpty(data.setup.synthesizers)) {
            return <Placeholder>No synthesizers defined. Go to the Setup tab.</Placeholder>
        } else {
            return <Placeholder>Select a song or cue to edit it</Placeholder>
        }
    }

    addSong() {
        const { data, setData } = this.props
        const { songs, cues } = data.show
        
        const { selectedId } = this.state
        const { songId, cueId } = selectedId || {}

        let newNumber
        if (_.isEmpty(songs)) {
            newNumber = "1"
        } else if (songId !== undefined) {
            // a song is selected, insert after
            const song = _.find(songs, { id: songId })
            newNumber = generateNext(song.number, songs.map(s => s.number))
        } else if (cueId !== undefined) {
            // a cue is selected, insert after its song
            const cue = _.find(cues, { id: cueId })
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
        this.setState({ selectedId: { songId: id } })
    }

    deleteSong() {
        const { data, setData } = this.props
        const { songs, cues } = data.show
        
        const { selectedId } = this.state
        const { songId } = selectedId

        _.remove(songs, { id: songId })
        _.remove(cues, { songId })
        setData('delete song')
        this.setState({ selectedId: undefined })
    }

    addCue() {
        const { data, setData } = this.props
        const { songs, cues } = data.show
        
        const { selectedId } = this.state
        const { songId, cueId } = selectedId || {}

        let resolvedSongId
        let newNumber
        if (songId !== undefined) {
            // a song is selected, add to the end of the song
            const songCues = _.filter(cues, { songId: songId }).sort(cueCompare)
            resolvedSongId = songId
            newNumber = generateNext(_.last(songCues).measure)
        } else if (cueId !== undefined) {
            // a cue is selected, insert after
            const cue = _.find(cues, { id: cueId })
            const song = _.find(songs, { id: cue.songId })
            const songCues = _.filter(cues, { songId: song.id }).sort(cueCompare)
            resolvedSongId = song.id
            newNumber = generateNext(cue.measure, songCues.map(c => c.measure))
        } else {
            // nothing is selected, add to the end of the last song
            const song = _.last(songs)
            const songCues = _.filter(cues, { songId: song.id }).sort(cueCompare)
            resolvedSongId = song.id
            newNumber = generateNext(_.last(songCues).measure)
        }

        const id = findId(cues)
        const newCue = {
            id,
            songId: resolvedSongId,
            measure: newNumber,
            patchUsages: []
        }
        cues.push(newCue)
        setData('add cue')
        this.setState({ selectedId: { cueId: id } })
    }

    deleteCue() {
        const { data, setData } = this.props
        const { cues } = data.show
        
        const { selectedId } = this.state
        const { cueId } = selectedId

        _.remove(cues, { id: cueId })
        setData('delete cue')
        this.setState({ selectedId: undefined })
    }
}

export default ShowTab
