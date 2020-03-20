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

        const header = <>
            Edit Song
            {modified && ' - Modified'}
            {error && <Warning>{error}</Warning>}
            {modified && !error && <Button onClick={() => this.save()}>Save</Button>}
        </>

        const setSongNumber = number => {
            const trimmed = number.trim()
            let error = validateSongOrMeasureNumber(trimmed)
            if (!error && trimmed !== song.number && _.some(data.show.songs, { number: trimmed })) {
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

        return <Container header={header}>
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

        song.number = songNumber
        song.name = songName
        setData()

        this.setState({ modified: false })
    }
}

export default SongEditor
