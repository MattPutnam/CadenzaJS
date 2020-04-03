import React from 'react'
import _ from 'lodash'

import { Select } from './Components'

import * as Midi from '../utils/Midi'


const ControlSelect = ({ selected, setSelected }) => {
    const options = _.range(0, 128)
    const render = Midi.longCCName

    return <Select {...{ options, selected, setSelected, render }}/>
}

export default ControlSelect
