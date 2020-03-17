import React from 'react'
import _ from 'lodash'

import { MidiInterfacePlaceholder } from './InterfaceSelector'

import Button from '../../../components/Button'
import Container from '../../../components/Container'
import { Flex } from '../../../components/Flex'
import Message from '../../../components/Message'
import MidiListener from '../../../components/MidiListener'

import * as Midi from '../../../utils/Midi'


const STAGE1 = 'Press the pedal...'
const STAGE2 = 'Release the pedal...'

const WAIT_TIME = 1000

class ActionPedalConfig extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            stage: undefined,
            error: undefined
        }
    }

    render() {
        const { stage, error } = this.state

        return <Container inner title='Action Pedal'>
            {stage && <MidiListener id='###ActionPedal###' dispatch={msg => this.handleMidi(msg)}/>}
            <Flex pad align='center'>
                {this.getDisplay()}
                {stage && <Message>{stage}</Message>}
                {error && <Message error>{error}</Message>}
                {!stage && <Button onClick={() => this.startListening()}>Listen...</Button>}
                {stage && <Button onClick={() => this.cancel()}>Cancel</Button>}
            </Flex>
        </Container>
    }

    getDisplay() {
        const { data } = this.props
        const { keyboards, actionPedal } = data.setup

        if (!actionPedal) {
            return 'Not set up'
        }
        if (keyboards.length === 0) {
            return 'No keyboards available'
        }

        const { keyboardId, controller, type, reverse } = actionPedal
        const keyboard = _.find(keyboards, { id: keyboardId })

        if (!keyboard) {
            return 'Keyboard not found'
        }

        const styles = {
            labelColumn: {
                textAlign: 'right'
            }
        }

        let { midiInterface, channel } = keyboard
        if (midiInterface === MidiInterfacePlaceholder) {
            midiInterface = 'Unconnected keyboard'
        }

        return <table>
            <tbody>
                {keyboards.length > 1 && <tr>
                    <td style={styles.labelColumn}>Keyboard:</td>
                    <td>{midiInterface} on channel {channel+1}</td>
                </tr>}
                <tr>
                    <td style={styles.labelColumn}>Controller:</td>
                    <td>{Midi.longCCName(controller)}</td>
                </tr>
                <tr>
                    <td style={styles.labelColumn}>Type:</td>
                    <td>{type}{reverse ? ', reversed' : ''}</td>
                </tr>
            </tbody>
        </table>
    }

    startListening() {
        this.stage1Signals = []
        this.setState({ stage: STAGE1, error: undefined })
    }

    goToStage2() {
        clearTimeout(this.timeoutID)
        this.stage2Signals = []
        this.setState({ stage: STAGE2 })
    }

    finish() {
        const { data, setData } = this.props
        const { keyboards } = data.setup
        const { stage1Signals, stage2Signals } = this

        clearTimeout(this.timeoutID)

        const reduce = ({ type, controller, midiInterface, channel }) => ({ type, controller, midiInterface, channel })
        const uniform = signals => _.size(_.uniqWith(_.map(signals, reduce), _.isEqual)) === 1

        if (uniform(_.concat(stage1Signals, stage2Signals))) {
            this.setState({ stage: undefined })

            const { channel, midiInterface, controller } = stage1Signals[0]
            const keyboard = _.find(keyboards, { channel, midiInterface })

            let type
            let reverse
            if (stage1Signals.length === 1 && stage2Signals.length === 1) {
                const s1 = stage1Signals[0]
                const s2 = stage2Signals[0]
                if (_.isEqual(s1, s2)) {
                    type = 'single value'
                } else if (s1.value < s2.value) {
                    type = 'alternating value'
                    reverse = true
                } else {
                    type = 'alternating value'
                }
            } else {
                type = 'continuous'

                if (stage1Signals[stage1Signals.length-1].value < stage1Signals[0].value) {
                    reverse = true
                }
            }

            data.setup.actionPedal = {
                keyboardId: keyboard.id,
                controller,
                type,
                reverse
            }
            setData()
        } else {
            this.setState({ error: 'Unable to determine, received signals from multiple sources.', stage: undefined })
        }
    }

    cancel() {
        this.setState({ stage: undefined, error: undefined })
    }

    handleMidi(parsedMessage) {
        const { stage } = this.state
        const { stage1Signals, stage2Signals } = this

        clearTimeout(this.timeoutID)

        if (stage === STAGE1) {
            stage1Signals.push(parsedMessage)
            if (parsedMessage.type === Midi.CONTROL && parsedMessage.value === 127) {
                this.goToStage2()
                return
            }
        } else if (stage === STAGE2) {
            stage2Signals.push(parsedMessage)
            if (parsedMessage.type === Midi.CONTROL && parsedMessage.value === 0) {
                this.finish()
                return
            }
        }

        this.timeoutID = setTimeout(() => {
            if (stage === STAGE1) {
                this.goToStage2()
            } else if (stage === STAGE2) {
                this.finish()
            }
        }, WAIT_TIME)
    }
}

export default ActionPedalConfig
