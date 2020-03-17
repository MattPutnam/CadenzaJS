import React from 'react'
import _ from 'lodash'

import Colors from '../../../components/colors'
import { ContainerButton } from '../../../components/Container'


const MultiChannelSelector = ({ synth, setData }) => {
    const styles = {
        channelButton: selected => ({
            display: 'inline-block',
            padding: '0.25rem',
            border: '1px solid black',
            backgroundColor: selected ? Colors.blue : undefined,
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
        <label>Channels:</label>
        <div>
            {_.range(0, 16).map(ch => {
                const selected = synth.channels.includes(ch)
                return <span key={ch}
                             style={styles.channelButton(selected)}
                             onClick={() => toggle(ch, selected)}>
                    {ch+1}
                </span>
            })}
        </div>
        <ContainerButton onClick={setAll}>All</ContainerButton>
        <ContainerButton onClick={setNone}>None</ContainerButton>
    </>
}

export default MultiChannelSelector
