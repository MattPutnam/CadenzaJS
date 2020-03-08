import React from 'react'

const SetupTab = () => {
    const [inputs, setInputs] = React.useState([])
    const [outputs, setOutputs] = React.useState([])

    React.useEffect(() => {
        navigator.requestMIDIAccess({}).then(midiAccess => {
            let iterator = midiAccess.inputs.values()
            let next = iterator.next()
            const startInputs = []
            while (!next.done) {
                startInputs.push(next.value)
                next = iterator.next()
            }
            setInputs(startInputs)

            iterator = midiAccess.outputs.values()
            next = iterator.next()
            const startOutputs = []
            while (!next.done) {
                startOutputs.push(next.value)
                next = iterator.next()
            }
            setOutputs(startOutputs)

            midiAccess.onstatechange = ({ port }) => {
                if (port.type === 'input') {
                    if (port.state === 'connected') {
                        if (!inputs.some(input => input.id === port.id)) {
                            inputs.push(port)
                            setInputs(inputs)
                        }
                    } else if (port.state === 'disconnected') {
                        setInputs(inputs.filter(o => o.id !== port.id))
                    }
                } else if (port.type === 'output') {
                    if (port.state === 'connected') {
                        if (!outputs.some(output => output.id === port.id)) {
                            outputs.push(port)
                            setOutputs(outputs)
                        }
                    } else if (port.state === 'disconnected') {
                        setOutputs(outputs.filter(o => o.id !== port.id))
                    }
                }
            }
        })
    })

    return <div>
        <div>
            <div>Inputs</div>
            {inputs.map(input =>
                <div>{input.manufacturer} {input.name}</div>)
            }
        </div>
        <div>
            <div>Outputs</div>
            {outputs.map(output =>
                <div>{output.manufacturer} {output.name}</div>)}
        </div>
    </div>
}

export default SetupTab
