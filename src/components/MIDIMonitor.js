import React from 'react'
import * as Midi from '../utils/Midi'
import MidiListener from './MidiListener'

const MidiMonitor = () => {
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
        <div style={styles.display}>{Midi.toString(message)}</div>
        <div style={styles.label}>Midi In</div>
        <MidiListener id="###MONITOR###" dispatch={setMessage}/>
    </div>
}

export default MidiMonitor
