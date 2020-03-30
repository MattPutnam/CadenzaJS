import React from 'react'

import { Select } from '../../../components/Components'
import { Center } from '../../../components/Layout'


const HarpPedalsEditor = ({ patchUsage, setData }) => {
    const pedalSettings = patchUsage.pedalSettings || [0, 0, 0, 0, 0, 0, 0]
    const setPedalSetting = index => value => {
        pedalSettings[index] = parseInt(value)
        patchUsage.pedalSettings = pedalSettings
        setData('harp pedal change')
    }

    const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B']

    return (
        <Center pad>
            {notes.map((note, index) => {
                return <HarpPedal key={index}
                                  baseKey={note}
                                  selected={pedalSettings[index]}
                                  setSelected={setPedalSetting(index)}/>
            })}
        </Center>
    )
}

export default HarpPedalsEditor


const HarpPedal = ({ baseKey, selected, setSelected }) => {
    const options = [
        { label: `${baseKey}♭`, value: -1 },
        { label: `${baseKey}♮`, value: 0 },
        { label: `${baseKey}♯`, value: 1 },
        { label: 'OFF', value: 2 }
    ]

    const valueRender = option => option.value
    const render = option => option.label

    return <Select {...{ options, selected, setSelected, render, valueRender }}/>
}
