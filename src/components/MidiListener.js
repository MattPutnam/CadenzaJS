import React from 'react'

import * as Midi from '../utils/Midi'


const MidiListener = ({ dispatch, id, keyboardId }) => {
    React.useEffect(() => {
        let filter
        if (keyboardId !== undefined) {
            filter = msg => msg.keyboardId === keyboardId
        }

        Midi.addMidiListener(dispatch, id, filter)
        return () => Midi.removeMidiListener(id)
    }, [dispatch, id, keyboardId])
    return null
}

export default MidiListener
