import React from 'react'

import * as Synthesizers from '../../../synthesizers/synthesizers'
import * as Expansions from '../../../synthesizers/expansions'


const ExpansionConfig = ({ synth, setData }) => {
    const synthDefinition = Synthesizers.getSynthByName(synth.name)

    return <table>
        <tbody>
            {synthDefinition.expansions.map(expansionSlot => {
                return <tr key={expansionSlot.name}>
                    <td>{expansionSlot.name}:</td>
                    <td><ExpansionSelector {...{ synth, expansionSlot, setData }}/></td>
                </tr>
            })}
        </tbody>
    </table>
}

export default ExpansionConfig


const ExpansionSelector = ({ synth, expansionSlot, setData }) => {
    const options = Expansions.expansionsOfType(expansionSlot.type)
    const value = synth.expansionCards[expansionSlot.name]
    const onChange = selection => {
        synth.expansionCards[expansionSlot.name] = selection
        setData()
    }

    return <select value={value} onChange={e => onChange(e.target.value)}>
        <option value={undefined}>None</option>
        {options.map(option => {
            const optionName = option.name
            return <option key={optionName+value} value={optionName}>{optionName}</option>
        })}
    </select>
}
