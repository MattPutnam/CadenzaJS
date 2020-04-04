import React from 'react'
import _ from 'lodash'

import { Button, TextField, Warning } from '../../../components/Components'
import { Container } from '../../../components/Container'
import { Flex } from '../../../components/Layout'

import { validateSongOrMeasureNumber } from '../../../utils/SongAndMeasureNumber'


class SongLocationEditor extends React.Component {
    constructor(props) {
        super(props)

        const song = _.find(props.data.show.songs, { id: props.songId })

        this.state = {
            modified: false,
            error: undefined,
            songNumber: song.number
        }

        this.ref = React.createRef()
    }

    render() {
        const { songId, data, setData } = this.props
        const { songs } = data.show
        const { songNumber, modified, error } = this.state

        const song = _.find(songs, { id: songId })

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
            song.name = name
            setData('set song name', `songName${songId}`)
        }

        const styles = {
            nameField: {
                flex: '1 1 auto'
            },
            button: {
                marginRight: '0.5rem'
            }
        }

        return (
            <Container alt>
                <Flex pad>
                    <TextField ref={this.ref}
                               label='Number:'
                               size={6}
                               value={songNumber}
                               setValue={setSongNumber}/>
                    {modified && <span>- Modified</span>}
                    {error && <Warning>{error}</Warning>}
                    {modified && !error && <Button style={styles.button} onClick={() => this.save()}>Save</Button>}
                    <TextField label='Name:'
                               style={styles.nameField}
                               value={song.name}
                               setValue={setSongName}/>
                </Flex>
            </Container>
        )
    }

    componentDidMount() {
        this.ref.current.focus()
    }

    save() {
        const { songId, data, setData } = this.props
        const { songNumber } = this.state
        
        const song = _.find(data.show.songs, { id: songId })

        song.number = songNumber
        setData('set song number')
        this.setState({ modified: false })
    }
}

export default SongLocationEditor
