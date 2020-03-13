import React from 'react'
import * as Midi from '../utils/Midi'


const MidiListener = ({ dispatch, id }) => {
    React.useEffect(() => {
        Midi.addMidiListener(dispatch, id)
        return () => Midi.removeMidiListener(id)
    })
    return null
}

export default MidiListener
