import React from 'react'

import { synthNames } from '../synthesizers/synthesizers'


const SynthSelector = ({ selected }) => {
    return <select value={selected} onChange={() => console.log('TODO')}>
        {synthNames.map(synthName => <option key={synthName} value={synthName}>{synthName}</option>)}
    </select>
}

export default SynthSelector
