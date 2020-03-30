import React from 'react'
import _ from 'lodash'

import { TextField, Button, Warning } from '../../../components/Components'
import Icons from '../../../components/Icons'
import { Container, Flex } from '../../../components/Layout'
import Transpose from '../../../components/Transpose'
import TriggerEditor from '../../../components/TriggerEditor'

import { validateSongOrMeasureNumber } from '../../../utils/SongAndMeasureNumber'


class SongEditor extends React.Component {
    constructor(props) {
        super(props)

        const song = _.find(props.data.show.songs, { id: props.songId })
        const { number, name } = song

        this.state = {
            modified: false,
            error: undefined,
            songNumber: number,
            songName: name
        }

        this.ref = React.createRef()
    }

    render() {
        const { songId, deleteSelf, data, setData } = this.props
        const { songNumber, songName, modified, error } = this.state

        const song = _.find(data.show.songs, { id: songId })

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
                <TriggerEditor object={song} data={data} setData={setData}/>
            </Container>
        )
    }

    componentDidMount() {
        this.ref.current.focus()
    }

    save() {
        const { songId, data, setData } = this.props
        const { songNumber, songName } = this.state
        
        const song = _.find(data.show.songs, { id: songId })

        song.number = songNumber
        song.name = songName
        setData('set song name and number')

        this.setState({ modified: false })
    }
}

export default SongEditor
