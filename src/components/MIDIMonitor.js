import React from 'react'
import * as MIDI from '../utils/MIDI'

const MIDIMonitor = ({ lastMidiMessage }) => {
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

    return <div style={styles.container}>
        <div style={styles.display}>{MIDI.toString(lastMidiMessage || {})}</div>
        <div style={styles.label}>MIDI In</div>
    </div>
}

export default MIDIMonitor
