import React from 'react'

import { Button, Message } from '../../../components/Components'
import MidiListener from '../../../components/MidiListener'

import * as Midi from '../../../utils/Midi'


const CUSTOM = 'CUSTOM'

const options = [
    { label: '88 keys', value: [21, 108] },
    { label: '76 keys', value: [28, 103] },
    { label: '61 keys', value: [36, 96] },
    { label: '54 keys', value: [36, 89] },
    { label: '49 keys', value: [36, 84] },
    { label: '37 keys (low F)', value: [41, 77] },
    { label: '37 keys (low C)', value: [48, 84] },
    { label: '36 keys (low F)', value: [41, 76] },
    { label: '36 keys (low C)', value: [48, 83] },
    { label: '32 keys (low F)', value: [41, 72] },
    { label: '32 keys (low C)', value: [48, 79] },
    { label: '25 keys', value: [48, 72] },
    { label: 'Custom...', value: CUSTOM }
]

const STAGE1 = 'Press leftmost key...'
const STAGE2 = 'Press rightmost key...'

class KeyboardSizeSelector extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            selectedValue: props.keyboard.range,
            stage: undefined,
            leftNote: undefined
        }
    }

    render() {
        const { keyboard } = this.props
        const { selectedValue, stage } = this.state

        const isCustomRange = !options.map(opt => opt.value.toString()).includes(keyboard.range.toString())
    
        return <>
            <select value={selectedValue.toString()} onChange={e => this.handleChange(e.target.value)}>
                {options.map(({ label, value }, index) =>
                    <option key={index} value={value.toString()}>{label}</option>
                )}
                {isCustomRange && <option value={selectedValue.toString()}>Custom Range</option>}
            </select>
            {!!stage && <>
                <Message>{stage}</Message>
                <MidiListener id={`KSS${keyboard.id}`} dispatch={msg => this.handleMidi(msg)}/>
                <Button onClick={() => this.cancelCustom()}>Cancel</Button>
            </>}
        </>
    }

    handleChange(selection) {
        const { keyboard, setData } = this.props

        if (selection === CUSTOM) {
            this.setState({ selectedValue: CUSTOM, stage: STAGE1 })
        } else {
            const range = selection.split(',').map(n => parseInt(n))
            keyboard.range = range
            setData()
            this.setState({ selectedValue: range })
        }
    }

    cancelCustom() {
        const { keyboard } = this.props

        this.setState({ selectedValue: keyboard.range, stage: undefined, leftNote: undefined })
    }

    handleMidi(parsedMessage) {
        const { keyboard, setData } = this.props
        const { stage, leftNote } = this.state
        const { type, note, channel, midiInterface } = parsedMessage

        if (type === Midi.NOTE_ON && keyboard.midiInterface === midiInterface && keyboard.channel === channel) {
            if (stage === STAGE1) {
                this.setState({ leftNote: note, stage: STAGE2 })
            } else if (stage === STAGE2) {
                const range = [leftNote, note].sort((a, b) => a - b)
                keyboard.range = range
                setData()
                this.setState({ selectedValue: range, stage: undefined, leftNote: undefined })
            }
        }
    }
}

export default KeyboardSizeSelector
