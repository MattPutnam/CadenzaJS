import React from 'react'
import _ from 'lodash'

import Keyboard from '../../../components/Keyboard'
import { Center, Container } from '../../../components/Layout'


const RangeSelector = ({ patchUsage, data, setData }) => {
    const { keyboards } = data.setup
    const keyboard = _.find(keyboards, { id: patchUsage.keyboardId })
    const [keyboardLow, keyboardHigh] = keyboard.range

    const onKeyClick = key => {
        onRangeDrag([key, key])
    }

    const onRangeDrag = ([low, high]) => {
        delete patchUsage.lowNote
        delete patchUsage.highNote
        if (low !== keyboardLow) {
            patchUsage.lowNote = low
        }
        if (high !== keyboardHigh) {
            patchUsage.highNote = high
        }
        setData()
    }

    return <Container header='Set Range'>
        <Center pad>
            <Keyboard listenerId='RANGE_SELECT' {...{ keyboard, onKeyClick, onRangeDrag }}/>
        </Center>
    </Container>
}

export default RangeSelector
