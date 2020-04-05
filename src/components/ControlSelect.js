import React from 'react'
import _ from 'lodash'

import { Select } from './Components'

import * as Midi from '../utils/Midi'


export const ControlSelect = ({ selected, setSelected }) => {
    const options = _.range(0, 128)
    const render = Midi.longCCName

    return <Select {...{ options, selected, setSelected, render }}/>
}

export const ControlOrNoneSelect = ({ selected, setSelected }) => {
    const options = _.range(-1, 128)
    const render = number => {
        if (number === -1) {
            return 'None (Disable)'
        } else {
            return Midi.longCCName(number)
        }
    }

    return <Select {...{ options, selected, setSelected, render }}/>
}
