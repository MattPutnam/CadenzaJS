import React from 'react'
import _ from 'lodash'

import { TextField, Button, Warning } from '../../../components/Components'
import Icons from '../../../components/Icons'
import { Container, Flex } from '../../../components/Layout'
import Transpose from '../../../components/Transpose'

import { validateSongOrMeasureNumber, songCompare } from '../../../utils/SongAndMeasureNumber'


class SongEditor extends React.Component {
    constructor(props) {
        super(props)

        const { number, name } = props.song

        this.state = {
            modified: false,
            error: undefined,
            songNumber: number,
            songName: name
        }

        this.ref = React.createRef()
    }

    render() {
        const { song, deleteSelf, data, setData } = this.props
        const { songNumber, songName, modified, error } = this.state

        const styles = {
            nameField: {
                flex: '1 1 auto'
            }
        }

        const setSongNumber = number => {
            const trimmed = number.trim()
            const trimmedTL = trimmed.toLowerCase()
            let error = validateSongOrMeasureNumber(trimmed)
            if (!error && trimmedTL !== song.number.toLowerCase() && _.some(data.show.songs, s => s.number.toLowerCase() === trimmedTL)) {
                error = 'Another song with that number already exists'
            }
            this.setState({ songNumber: trimmed, modified: true, error })
        }

        const setSongName = name => {
            let error
            if (_.isEmpty(name)) {
                error = 'Song name must be specified'
            }
            this.setState({ songName: name, modified: true, error })
        }

        const postHeader = <>
            {modified && <span>&nbsp;- Modified</span>}
            {error && <Warning>{error}</Warning>}
            {modified && !error && <Button onClick={() => this.save()}>Save</Button>}
        </>

        const buttons = [{ icon: Icons.delete, onClick: deleteSelf }]

        return (
            <Container header='Edit song' postHeader={postHeader} buttons={buttons}>
                <Container alt>
                    <Flex pad>
                        <TextField ref={this.ref}
                                   label='Number:'
                                   size={6}
                                   value={songNumber}
                                   setValue={setSongNumber}/>
                        <TextField label='Name:'
                                   style={styles.nameField}
                                   value={songName}
                                   setValue={setSongName}/>
                    </Flex>
                </Container>
                <Transpose alt object={song} setData={setData}/>
            </Container>
        )
    }

    componentDidMount() {
        this.ref.current.focus()
    }

    save() {
        const { song, data, setData } = this.props
        const { songNumber, songName } = this.state

        const sortSongs = song.number !== songNumber

        song.number = songNumber
        song.name = songName
        if (sortSongs) {
            data.show.songs.sort(songCompare)
        }
        setData()

        this.setState({ modified: false })
    }
}

export default SongEditor
