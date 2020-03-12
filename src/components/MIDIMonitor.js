import React from 'react'
import * as MIDI from '../utils/MIDI'
import MidiListener from './MidiListener'

const MIDIMonitor = () => {
    const styles = {
        container: {
            width: '100px',
            textAlign: 'center',
            padding: 4,
            backgroundColor: '#1E2D45',
            color: '#859BB3',
            borderRadius: 3
        },
        display: {
            fontSize: '85%',
            padding: 2
        },
        label: {
            fontSize: '50%'
        }
    }

    const [message, setMessage] = React.useState({})

    return <div style={styles.container}>
        <div style={styles.display}>{MIDI.toString(message)}</div>
        <div style={styles.label}>MIDI In</div>
        <MidiListener id="###MIDI_MONITOR###" dispatch={setMessage}/>
    </div>
}

export default MIDIMonitor
