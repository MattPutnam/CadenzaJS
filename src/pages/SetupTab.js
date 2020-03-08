import React from 'react'

const SetupTab = ({ midiDevices }) => {
    return <div>
        <div>Inputs</div>
        <select>
            <option value={0}>I'll connect later</option>
            {midiDevices.inputs.map(input =>
                <option value={input.id}>{input.manufacturer} {input.name}</option>)}
        </select>
        <div>Outputs</div>
        <select>
            <option value={0}>I'll connect later</option>
            {midiDevices.outputs.map(output =>
                <option value={output.id}>{output.manufacturer} {output.name}</option>)}
        </select>
    </div>
}

export default SetupTab
