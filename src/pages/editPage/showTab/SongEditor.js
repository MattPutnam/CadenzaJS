import React from 'react'
import _ from 'lodash'

import { TextField, Button, Warning } from '../../../components/Components'
import { Container, Flex } from '../../../components/Layout'

import { validateSongOrMeasureNumber } from '../../../utils/SongAndMeasureNumber'


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
    }

    render() {
        const { song, data } = this.props
        const { songNumber, songName, modified, error } = this.state

        const styles = {
            nameField: {
                flex: '1 1 auto'
            }
        }

        const postHeader = <>
            {modified && <span>&nbsp;- Modified</span>}
            {error && <Warning>{error}</Warning>}
            {modified && !error && <Button onClick={() => this.save()}>Save</Button>}
        </>

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

        return <Container header='Edit song' postHeader={postHeader}>
            <Container alt>
                <Flex pad>
                    <TextField label='Number:'
                               size={6}
                               value={songNumber}
                               setValue={setSongNumber}/>
                    <TextField label='Name:'
                               style={styles.nameField}
                               value={songName}
                               setValue={setSongName}/>
                </Flex>
            </Container>
        </Container>
    }

    save() {
        const { song, setData } = this.props
        const { songNumber, songName } = this.state

        const sortSongs = song.number !== songNumber

        song.number = songNumber
        song.name = songName
        setData({ sortSongs })

        this.setState({ modified: false })
    }
}

export default SongEditor
