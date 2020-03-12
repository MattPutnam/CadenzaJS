import React from 'react'
import * as MIDI from '../utils/MIDI'


const MidiListener = ({ dispatch, id }) => {
    React.useEffect(() => {
        MIDI.addMidiListener(dispatch, id)
        return () => MIDI.removeMidiListener(id)
    })
    return null
}

export default MidiListener
