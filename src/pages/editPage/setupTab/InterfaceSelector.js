import React from 'react'

import { Warning } from '../../../components/Components'

import * as Midi from '../../../utils/Midi'


export const MidiInterfacePlaceholder = 'I\'ll connect later'

const InterfaceSelector = ({ midiInterfaces, io, setData, hardware }) => {
    const id = `${io}SelectorFor${hardware.id}`
    const selected = hardware.midiInterface
    const values = midiInterfaces[io].map(midiInterface => `${midiInterface.manufacturer} ${midiInterface.name}`)
    const missing = selected !== MidiInterfacePlaceholder && !values.includes(selected)

    return <>
        <label htmlFor={id}>Interface: </label>
        <select id={id}
                value={selected}
                onChange={e => { hardware.midiInterface = e.target.value; setData() }}>
            <option value={MidiInterfacePlaceholder}>{MidiInterfacePlaceholder}</option>
            {midiInterfaces[io].map(midiInterface => {
                const label = Midi.midiInterfaceToName(midiInterface)
                return <option key={midiInterface.id} value={label}>{label}</option>
            })}
            {missing && <option value={selected}>{selected}</option>}
        </select>
        {missing && <Warning>Interface not found</Warning>}
    </>
}

export default InterfaceSelector
