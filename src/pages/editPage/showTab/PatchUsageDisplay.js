import React from 'react'
import _ from 'lodash'

import Colors from '../../../components/colors'
import { ButtonLike, Placeholder } from '../../../components/Components'
import Keyboard from '../../../components/Keyboard'
import { Center, Container, Flex } from '../../../components/Layout'

import * as KeyboardUtils from '../../../utils/KeyboardUtils'


const PatchUsageDisplay = ({ cue, selectedPatchUsage, setSelectedPatchUsage, data, setData }) => {
    const { keyboards } = data.setup

    const patchUsagesByKeyboardId = _.groupBy(cue.patchUsages, 'keyboardId')

    const onRangeDrag = (keyboard, low, high) => {
        const [keyboardLow, keyboardHigh] = keyboard.range
        const lowNote = low <= keyboardLow ? undefined : low
        const highNote = high >= keyboardHigh ? undefined : high

        const newPatchUsage = {
            keyboardId: keyboard.id,
            lowNote, highNote,
            patchId: -1
        }

        cue.patchUsages.push(newPatchUsage)
        setData()
        setSelectedPatchUsage(newPatchUsage)
    }

    return (
        <Container alt collapse header='Drag a range of notes to add a patch'>
            {_.isEmpty(keyboards) && <Placeholder height='50px'>No keyboards defined</Placeholder>}
            {keyboards.map(keyboard => {
                const patchUsages = patchUsagesByKeyboardId[keyboard.id] || []
                const patchUsageRows = KeyboardUtils.groupIntoRows(patchUsages)
                return (
                    <Center pad key={keyboard.id}>
                        <Flex column align='stretch'>
                            <Keyboard keyboard={keyboard}
                                      onKeyClick={key => onRangeDrag(keyboard, key, key)}
                                      onRangeDrag={([low, high]) => onRangeDrag(keyboard, low, high)}/>
                            {patchUsageRows.map((patchUsageRow, index) => {
                                return <PatchUsageRow key={index} {...{ patchUsageRow, keyboard, data, selectedPatchUsage, setSelectedPatchUsage }}/>
                            })}
                        </Flex>
                    </Center>
                )
            })}
        </Container>
    )
}

export default PatchUsageDisplay


const PatchUsageRow = ({ patchUsageRow, keyboard, data, selectedPatchUsage, setSelectedPatchUsage }) => {
    const tagged = patchUsageRow.map(patchUsage => {
        return {
            patchUsage,
            ...KeyboardUtils.getDimensions(keyboard.range, patchUsage)
        }
    })

    const styles = {
        spacer: amt => ({
            flex: `0 0 ${amt}px`
        }),
        patchUsage: (width, selected) => {
            return ({
                flex: `0 0 ${width}px`,
                padding: '0.25rem 1px',
                border: '1px solid black',
                textAlign: 'center',
                backgroundColor: selected ? Colors.blue : 'white',
                color: selected ? 'white' : 'black',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                cursor: 'pointer'
            })
        }
    }

    let index = 0
    let accum = 0
    const elements = []
    tagged.forEach(({ patchUsage, left, width }) => {
        let adjustedWidth = width
        if (left > accum) {
            const diff = left - accum
            elements.push(<div key={index++} style={styles.spacer(diff)}/>)
        } else if (left < accum) {
            adjustedWidth -= accum-left
        }
        const { patchId } = patchUsage
        const patch = _.find(data.patches, { id: patchId })
        const selected = selectedPatchUsage === patchUsage
        elements.push(
            <ButtonLike key={index++}
                        style={styles.patchUsage(adjustedWidth, selected)}
                        onClick={() => setSelectedPatchUsage(patchUsage)}>
                {patch ? patch.name : 'No Patch Selected'}
            </ButtonLike>
        )
        accum = left + width
    })

    return <Flex>{elements}</Flex>
}
