import React from 'react'

import Colors from './Colors'
import MidiListener from './MidiListener'

import * as Midi from '../utils/Midi'


const MidiMonitor = () => {
    const styles = {
        container: {
            width: '120px',
            textAlign: 'center',
            padding: 4,
            backgroundColor: Colors.blue[0],
            color: Colors.blue[3],
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

    return (
        <div style={styles.container}>
            <div style={styles.label}>MIDI In</div>
            <div style={styles.midiInterface}>{message ? message.midiInterfaceName : '--'}</div>
            <div style={styles.message}>{message ? Midi.toString(message) : '--'}</div>
            <MidiListener id='MONITOR' dispatch={setMessage}/>
        </div>
    )
}

export default MidiMonitor
