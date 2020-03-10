import React from 'react'

const PortSelector = ({ devices, io, selected }) => {
    const values = devices[io].map(device => `${device.manufacturer} ${device.name}`)
    const missing = !values.includes(selected)

    const styles = {
        select: {
            fontSize: '100%'
        }
    }

    return <select value={selected}
                   style={styles.select}
                   onChange={() => console.log("TODO")}>
        <option value={0}>I'll connect later</option>
        {devices[io].map(device => {
            const label = `${device.manufacturer} ${device.name}`
            return <option key={device.id} value={label}>{label}</option>
        })}
        {missing && <option value={selected}>{selected}</option>}
    </select>
}

export default PortSelector
