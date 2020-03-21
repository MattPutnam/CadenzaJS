import React from 'react'
import _ from 'lodash'
import { FaCaretDown, FaCaretRight, FaFolderPlus, FaPlus } from 'react-icons/fa'

import CueEditor from './showTab/CueEditor'
import SongEditor from './showTab/SongEditor'

import Colors from '../../components/colors'
import { Placeholder, ButtonLike } from '../../components/Components'
import { Container, Flex } from '../../components/Layout'

import { cueCompare, generateNext } from '../../utils/SongAndMeasureNumber'


class ShowTab extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            collapsedSongs: new Set(),
            selectedSong: undefined,
            selectedCue: undefined
        }
    }

    render() {
        const style = {
            flex: '1 1 auto',
            overflow: 'hidden'
        }
    
        return <Flex align='stretch' style={style}>
            {this.cuesList()}
            {this.editPane()}
        </Flex>
    }

    cuesList() {
        const { data } = this.props
        const { songs } = data.show

        const { collapsedSongs, selectedSong, selectedCue } = this.state

        const styles = {
            list: {
                alignSelf: 'stretch',
                overflowY: 'auto'
            },
            song: selected => ({
                alignSelf: 'stretch',
                margin: '3px 0',
                fontWeight: selected ? 'bold' : undefined,
                backgroundColor: selected ? Colors.blue : Colors.darkGray,
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
                backgroundColor: selected ? Colors.blue : undefined,
                paddingLeft: '0.5rem',
                cursor: 'pointer'
            })
        }

        const toggleSongCollapse = (number, collapsed) => {
            if (collapsed) {
                collapsedSongs.delete(number)
            } else {
                collapsedSongs.add(number)
            }
            this.setState({ collapsedSongs })
        }

        const keyCollapse = number => e => {
            if (e.key === 'ArrowRight') {
                toggleSongCollapse(number, false)
            } else if (e.key === 'ArrowLeft') {
                toggleSongCollapse(number, true)
            }
        }

        const buttons = [
            { icon: FaFolderPlus, onClick: () => this.addSong() },
            { icon: FaPlus, onClick: () => this.addCue() }
        ]

        return <Container header='Cues' flex='0 0 200px' buttons={buttons}>
            <div style={styles.list}>
                {songs.map(song => {
                    const { number, name, cues } = song
                    const collapsed = collapsedSongs.has(number)
                    const songSelected = song === selectedSong && !selectedCue
                    const caretProps = {
                        style: styles.songCaret,
                        onClick: () => toggleSongCollapse(number, collapsed)
                    }

                    return <React.Fragment key={`Song#${number}`}>
                        <Flex element={ButtonLike}
                              align='center'
                              style={styles.song(songSelected)}
                              onKeyDown={keyCollapse(number)}
                              onClick={() => this.setState({ selectedSong: song, selectedCue: undefined })}>
                            {collapsed ? <FaCaretRight {...caretProps}/> : <FaCaretDown {...caretProps}/>}
                            <span style={styles.songTitle}>
                                {number}: {name}
                            </span>
                        </Flex>
                        {!collapsed && cues.map(cue => {
                            const { measure } = cue
                            const cueSelected = selectedCue === cue

                            return <ButtonLike key={`Song#${number}Cue#${measure}`}
                                               style={styles.cue(cueSelected)}
                                               onClick={() => this.setState({ selectedSong: song, selectedCue: cue })}>
                                m. {measure}
                            </ButtonLike>
                        })}
                    </React.Fragment>
                })}
            </div>
        </Container>
    }

    editPane() {
        const { data, setData } = this.props
        const { selectedSong, selectedCue } = this.state

        const setParentSong = newSong => this.setState({ selectedSong: newSong })

        if (selectedCue) {
            const key = `Song#${selectedSong.number}Cue#${selectedCue.measure}`
            return <CueEditor key={key} song={selectedSong} cue={selectedCue} {...{ data, setData, setParentSong }}/>
        } else if (selectedSong) {
            return <SongEditor key={selectedSong.number} song={selectedSong} {...{ data, setData }}/>
        } else if (_.isEmpty(data.setup.synthesizers)) {
            return <Placeholder>Warning: no synthesizers defined. Go to the Setup tab.</Placeholder>
        } else {
            return <Placeholder>Select a song or cue to edit it</Placeholder>
        }
    }

    addSong() {
        const { data, setData } = this.props
        const { songs } = data.show
        const { selectedSong } = this.state

        let newNumber
        if (_.isEmpty(songs)) {
            newNumber = 1
        } else if (selectedSong) {
            newNumber = generateNext(selectedSong.number, songs.map(s => s.number))
        } else {
            newNumber = generateNext(_.last(songs).number)
        }

        const newSong = {
            number: newNumber,
            name: '',
            cues: []
        }
        data.show.songs.push(newSong)
        setData({ sortSongs: true })
        this.setState({ selectedSong: newSong, selectedCue: undefined })
    }

    addCue() {
        const { setData } = this.props
        const { selectedSong, selectedCue } = this.state

        let newNumber
        if (_.isEmpty(selectedSong.cues)) {
            newNumber = 1
        } else if (selectedCue) {
            newNumber = generateNext(selectedCue.measure, selectedSong.cues.map(c => c.measure))
        } else {
            newNumber = generateNext(_.last(selectedSong.cues).measure)
        }

        const newCue = {
            measure: newNumber,
            patchUsages: []
        }
        selectedSong.cues.push(newCue)
        selectedSong.cues.sort(cueCompare)
        setData()
        this.setState({ selectedCue: newCue })
    }
}

export default ShowTab
