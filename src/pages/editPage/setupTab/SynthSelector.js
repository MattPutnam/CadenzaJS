import React from 'react'

import * as Synthesizers from '../../../synthesizers/synthesizers'


const SynthSelector = ({ synth, inUse, setData }) => {
    const onChange = selection => {
        synth.name = selection
        synth.expansionCards = {}
        setData('change synthesizer')
    }

    return (
        <select value={synth.name} disabled={inUse} onChange={e => onChange(e.target.value)}>
            {Synthesizers.synthNames.map(synthName => <option key={synthName} value={synthName}>{synthName}</option>)}
        </select>
    )
}

export default SynthSelector
