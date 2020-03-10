import React from 'react'
import Container from '../components/Container'
import PortSelector from '../components/PortSelector'

const styles = {
    pedalContainer: {
        display: 'flex'
    },
    pedalItem: {
        flex: '1 1 auto'
    }
}

const KeyboardConfig = ({ keyboard }) => {
    return <Container inner>{keyboard.name}</Container>
}

const KeyboardPlaceholder = () => {
    return <Container inner>
        Hey! Add a keyboard!
    </Container>
}

const SynthConfig = ({ synth, midiDevices }) => {
    return <Container inner>
        {synth.name}
        <PortSelector devices={midiDevices} io="outputs" selected={synth.outputDevice}/>
    </Container>
}

const SynthPlaceholder = () => {
    return <Container inner>
        Hey! Add a synthesizer!
    </Container>
}

const EditPedalConfig = ({ pedal }) => {
    return <Container inner style={styles.pedalItem} title="Edit Pedal">
        Edit Pedal
    </Container>
}

const SustainPedalConfig = ({ pedal }) => {
    return <Container inner style={styles.pedalItem} title="Sustain Pedal">
        Sustain Pedal
    </Container>
}

const SetupTab = ({ midiDevices, showData }) => {
    const { keyboards, synthesizers, editPedal, sustainPedal } = showData.setup

    return <>
        <Container title="Keyboards">
            {keyboards.map(keyboard => <KeyboardConfig key={keyboard.id} keyboard={keyboard}/>)}
            <KeyboardPlaceholder/>
            <div style={styles.pedalContainer}>
                <EditPedalConfig pedal={editPedal}/>
                <SustainPedalConfig pedal={sustainPedal}/>
            </div>
        </Container>
        <Container title="Synthesizers">
            {synthesizers.map(synth => <SynthConfig key={synth.id} synth={synth} midiDevices={midiDevices}/>)}
            <SynthPlaceholder/>
        </Container>
    </>
}

export default SetupTab
