import React from 'react'
import _ from 'lodash'

import Colors from '../../../components/colors'
import { ButtonLike } from '../../../components/Components'
import Keyboard from '../../../components/Keyboard'
import { Center, Container, Flex } from '../../../components/Layout'

import * as KeyboardUtils from '../../../utils/KeyboardUtils'


const PatchUsageDisplay = ({ cue, selectedPatchUsage, setSelectedPatchUsage, data }) => {
    const { keyboards } = data.setup

    const patchUsagesByKeyboardId = _.groupBy(cue.patchUsages, 'keyboardId')

    return <Container alt collapse header='Drag a range of notes to add a patch'>
        {keyboards.map(keyboard => {
            const patchUsages = patchUsagesByKeyboardId[keyboard.id] || []
            const patchUsageRows = KeyboardUtils.groupIntoRows(patchUsages)
            return <Center pad key={keyboard.id}>
                <Flex column align='stretch'>
                    <Keyboard keyboard={keyboard}/>
                    {patchUsageRows.map((patchUsageRow, index) => {
                        return <PatchUsageRow key={index} {...{ patchUsageRow, keyboard, data, selectedPatchUsage, setSelectedPatchUsage }}/>
                    })}
                </Flex>
            </Center>
        })}
    </Container>
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
        if (left > accum) {
            const diff = left - accum
            elements.push(<div key={index++} style={styles.spacer(diff)}></div>)
        }
        const { patchId } = patchUsage
        const patch = _.find(data.patches, { id: patchId })
        const selected = selectedPatchUsage === patchUsage
        elements.push(<ButtonLike key={index++} style={styles.patchUsage(width, selected)} onClick={() => setSelectedPatchUsage(patchUsage)}>
            {patch.name}
        </ButtonLike>)
        accum = left + width
    })

    return <Flex>
        {elements}
    </Flex>
}
