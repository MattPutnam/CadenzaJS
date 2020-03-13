import React from 'react'
import Warning from './Warning'
import * as Midi from '../utils/Midi'

export const MidiDevicePlaceholder = 'I\'ll connect later'

const PortSelector = ({ devices, io, selected }) => {
    const values = devices[io].map(device => `${device.manufacturer} ${device.name}`)
    const missing = selected !== MidiDevicePlaceholder && !values.includes(selected)

    return <>
        <select value={selected} onChange={() => console.log("TODO")}>
            <option value={0}>{MidiDevicePlaceholder}</option>
            {devices[io].map(device => {
                const label = Midi.midiDeviceToName(device)
                return <option key={device.id} value={label}>{label}</option>
            })}
            {missing && <option value={selected}>{selected}</option>}
        </select>
        {missing && <Warning>Device not found</Warning>}
    </>
}

export default PortSelector
