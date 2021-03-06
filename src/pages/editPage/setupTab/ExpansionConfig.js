import React from 'react'
import _ from 'lodash'

import * as Synthesizers from '../../../synthesizers/synthesizers'
import * as Expansions from '../../../synthesizers/expansions'


const ExpansionConfig = ({ synth, data, setData }) => {
    const synthDefinition = Synthesizers.getSynthByName(synth.name)

    return (
        <table>
            <tbody>
                {synthDefinition.expansions.map(expansionSlot => {
                    return (
                        <tr key={expansionSlot.name}>
                            <td>{expansionSlot.name}:</td>
                            <td><ExpansionSelector {...{ synth, expansionSlot, data, setData }}/></td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

export default ExpansionConfig


const ExpansionSelector = ({ synth, expansionSlot, data, setData }) => {
    const options = Expansions.expansionsOfType(expansionSlot.type)
    const value = synth.expansionCards[expansionSlot.name]
    const onChange = selection => {
        synth.expansionCards[expansionSlot.name] = selection
        setData('configure synthesizer expansions')
    }

    const inUse = _.some(data.patches, { synthesizerId: synth.id, bank: expansionSlot.name })

    return (
        <select disabled={inUse} value={value} onChange={e => onChange(e.target.value)}>
            <option value={undefined}>None</option>
            {options.map(option => {
                return <option key={option.number} value={option.number}>{`${option.number} ${option.name}`}</option>
            })}
        </select>
    )
}
