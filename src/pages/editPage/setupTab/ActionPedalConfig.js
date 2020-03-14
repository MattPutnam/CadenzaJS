import React from 'react'
import _ from 'lodash'

import Container from '../../../components/Container'

import * as Midi from '../../../utils/Midi'


class ActionPedalConfig extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            stage: undefined,
            stage1Signals: [],
            stage2Signals: []
        }
    }
    render() {
        return <Container inner title='Action Pedal'>
            {this.getDisplay()}
        </Container>
    }

    getDisplay() {
        const { pedal, keyboards } = this.props

        if (!pedal) {
            return 'Not set up'
        }
        if (keyboards.length === 0) {
            return 'No keyboards available'
        }

        const { keyboardId, control, type } = pedal
        const keyboard = _.find(keyboards, { id: keyboardId })

        if (!keyboard) {
            return 'Keyboard not found'
        }

        const styles = {
            labelColumn: {
                textAlign: 'right'
            }
        }

        return <table>
        <tbody>
            {keyboards.length > 1 && <tr>
                <td style={styles.labelColumn}>Keyboard:</td>
                <td>{keyboard.midiInterface} on channel {keyboard.channel+1}</td>
            </tr>}
            <tr>
                <td style={styles.labelColumn}>Controller:</td>
                <td>{Midi.ccNames[control].long}</td>
            </tr>
            <tr>
                <td style={styles.labelColumn}>Type:</td>
                <td>{type}</td>
            </tr>
        </tbody>
    </table>
    }
}

export default ActionPedalConfig
