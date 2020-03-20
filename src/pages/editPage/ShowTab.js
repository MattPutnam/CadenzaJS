import React from 'react'
import _ from 'lodash'
import { FaCaretDown, FaCaretRight } from 'react-icons/fa'

import SongEditor from './showTab/SongEditor'

import Colors from '../../components/colors'
import { Placeholder } from '../../components/Components'
import { Container, Flex } from '../../components/Layout'


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

        return <Container header='Cues' flex='0 0 200px'>
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
                        <Flex align='center' style={styles.song(songSelected)}>
                            {collapsed ? <FaCaretRight {...caretProps}/> : <FaCaretDown {...caretProps}/>}
                            <span style={styles.songTitle}
                                  onClick={() => this.setState({ selectedSong: song, selectedCue: undefined })}>
                                {number}: {name}
                            </span>
                        </Flex>
                        {!collapsed && cues.map(cue => {
                            const { measure } = cue
                            const cueSelected = selectedCue === cue

                            return <div key={`Song#${number}Cue#${measure}`}
                                        style={styles.cue(cueSelected)}
                                        onClick={() => this.setState({ selectedSong: song, selectedCue: cue })}>
                                m. {measure}
                            </div>
                        })}
                    </React.Fragment>
                })}
            </div>
        </Container>
    }

    editPane() {
        const { data, setData } = this.props
        const { selectedSong, selectedCue } = this.state

        if (selectedCue) {
            return <Container header='Edit Cue'>
                Edit {selectedCue.measure}
            </Container>
        } else if (selectedSong) {
            return <SongEditor key={selectedSong.number} song={selectedSong} data={data} setData={setData}/>
        } else if (_.isEmpty(data.setup.synthesizers)) {
            return <Placeholder>Warning: no synthesizers defined. Go to the Setup tab.</Placeholder>
        } else {
            return <Placeholder>Select a song or cue to edit it</Placeholder>
        }
    }
}

export default ShowTab
