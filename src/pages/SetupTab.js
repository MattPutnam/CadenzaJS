import React from 'react'
import Container from '../components/Container'

const SetupTab = ({ midiDevices }) => {
    const styles = {
        page: {
            // display: 'flex'
        },
        container: {
            // flex: '1 1 auto'
        }
    }

    return <div style={styles.page}>
        <Container title="Keyboards" style={styles.container}>
            <select>
                <option value={0}>I'll connect later</option>
                {midiDevices.inputs.map(input =>
                    <option key={input.id} value={input.id}>{input.manufacturer} {input.name}</option>)}
            </select>
        </Container>
        <Container title="Synthesizers" style={styles.container}>
            <select>
                <option value={0}>I'll connect later</option>
                {midiDevices.outputs.map(output =>
                    <option key={output.id} value={output.id}>{output.manufacturer} {output.name}</option>)}
            </select>
        </Container>
    </div>
}

export default SetupTab
