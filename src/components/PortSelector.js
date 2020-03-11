import React from 'react'
import Warning from './Warning'

const PortSelector = ({ devices, io, selected }) => {
    const values = devices[io].map(device => `${device.manufacturer} ${device.name}`)
    const missing = !values.includes(selected)

    return <>
        <select value={selected} onChange={() => console.log("TODO")}>
            <option value={0}>I'll connect later</option>
            {devices[io].map(device => {
                const label = `${device.manufacturer} ${device.name}`
                return <option key={device.id} value={label}>{label}</option>
            })}
            {missing && <option value={selected}>{selected}</option>}
        </select>
        {missing && <Warning>Device not found</Warning>}
    </>
}

export default PortSelector
