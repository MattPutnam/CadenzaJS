import React from 'react'
import * as Midi from '../utils/Midi'
import MidiListener from './MidiListener'

const MidiMonitor = () => {
    const styles = {
        container: {
            width: '120px',
            textAlign: 'center',
            padding: 4,
            backgroundColor: '#1E2D45',
            color: '#859BB3',
            borderRadius: 3
        },
        label: {
            fontSize: '60%'
        },
        midiInterface: {
            fontSize: '50%',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        },
        message: {
            fontFamily: 'monospace',
            fontSize: '85%',
            padding: 2,
            whiteSpace: 'pre'
        }
    }

    const [message, setMessage] = React.useState(undefined)

    return <div style={styles.container}>
        <div style={styles.label}>Midi In</div>
        <div style={styles.midiInterface}>{message ? message.midiInterface : '--'}</div>
        <div style={styles.message}>{message ? Midi.toString(message) : '--'}</div>
        <MidiListener id='###MONITOR###' dispatch={setMessage}/>
    </div>
}

export default MidiMonitor
