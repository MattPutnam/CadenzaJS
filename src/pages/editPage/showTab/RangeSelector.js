import React from 'react'
import _ from 'lodash'

import { Container, Header, HeaderButton, Title } from '../../../components/Container'
import Icons from '../../../components/Icons'
import Keyboard from '../../../components/Keyboard'
import { Center } from '../../../components/Layout'


const RangeSelector = ({ patchUsage, data, setData }) => {
    const { keyboards } = data.setup
    const keyboardIndex = _.findIndex(keyboards, { id: patchUsage.keyboardId })
    const keyboard = keyboards[keyboardIndex]
    const [keyboardLow, keyboardHigh] = keyboard.range

    const moreAbove = keyboardIndex > 0
    const moreBelow = keyboardIndex < keyboards.length - 1

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
        setData('set patch assignment range')
    }

    const move = newIndex => {
        const newKeyboard = keyboards[newIndex]
        patchUsage.keyboardId = newKeyboard.id
        const { lowNote, highNote } = patchUsage
        const [newKeyboardLow, newKeyboardHigh] = newKeyboard.range
        if (lowNote !== undefined) {
            if (lowNote > newKeyboardHigh) {
                patchUsage.lowNote = newKeyboardHigh
            } else if (lowNote < newKeyboardLow) {
                delete patchUsage.lowNote
            }
        }
        if (highNote !== undefined) {
            if (highNote < newKeyboardLow) {
                patchUsage.highNote = newKeyboardLow
            } else if (highNote > newKeyboardHigh) {
                delete patchUsage.highNote
            }
        }
        setData('move patch assignment')
    }

    return (
        <Container>
            <Header>
                <Title>Set Range</Title>
                {moreAbove && <HeaderButton icon={Icons.arrowUp} onClick={() => move(keyboardIndex-1)}/>}
                {moreBelow && <HeaderButton icon={Icons.arrowDown} onClick={() => move(keyboardIndex+1)}/>}
            </Header>
            <Center pad>
                <Keyboard highlightMidi={false} {...{ keyboard, onKeyClick, onRangeDrag }}/>
            </Center>
        </Container>
    )
}

export default RangeSelector
