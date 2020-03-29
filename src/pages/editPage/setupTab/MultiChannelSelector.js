import React from 'react'
import _ from 'lodash'

import { Button, Label } from '../../../components/Components'
import Colors from '../../../components/Colors'


const MultiChannelSelector = ({ synth, setData }) => {
    const styles = {
        channelButton: selected => ({
            display: 'inline-block',
            padding: '0.25rem',
            border: '1px solid black',
            backgroundColor: selected ? Colors.blue[2] : undefined,
            color: selected ? 'white' : undefined,
            cursor: 'pointer',
            width: 28,
            textAlign: 'center'
        })
    }

    const toggle = (ch, selected) => {
        if (selected) {
            _.remove(synth.channels, x => ch === x)
            setData()
        } else {
            synth.channels.push(ch)
            synth.channels.sort((a, b) => a - b)
            setData()
        }
    }

    const setAll = () => {
        synth.channels = _.range(0, 16)
        setData()
    }

    const setNone = () => {
        synth.channels = []
        setData()
    }

    return <>
        <Label>Channels:</Label>
        {_.range(0, 16).map(ch => {
            const selected = synth.channels.includes(ch)
            return (
                <span key={ch}
                      style={styles.channelButton(selected)}
                      onClick={() => toggle(ch, selected)}>
                    {ch+1}
                </span>
            )
        })}
        <Button small onClick={setAll}>All</Button>
        <Button small onClick={setNone}>None</Button>
    </>
}

export default MultiChannelSelector
