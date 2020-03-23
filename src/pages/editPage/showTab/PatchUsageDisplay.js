import React from 'react'
import _ from 'lodash'

import Colors from '../../../components/colors'
import { ButtonLike } from '../../../components/Components'
import Keyboard from '../../../components/Keyboard'
import { Center, Container, Flex } from '../../../components/Layout'

import * as KeyboardUtils from '../../../utils/KeyboardUtils'


const PatchUsageDisplay = ({ cue, selectedPatchUsage, setSelectedPatchUsage, data }) => {
    const { keyboards } = data.setup

    const styles = {
        patchUsage: ({ selected, keyboard, patchUsage }) => {
            const { left, width } = KeyboardUtils.getDimensions(keyboard.range, patchUsage)
            console.log(left, width)
            return ({
                display: 'block',
                position: 'relative',
                left: left,
                width: width,
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

    const patchUsagesByKeyboardId = _.groupBy(cue.patchUsages, 'keyboardId')

    return <Container alt collapse header='Drag a range of notes to add a patch'>
        {keyboards.map(keyboard => {
            const patchUsages = patchUsagesByKeyboardId[keyboard.id] || []
            return <Center pad key={keyboard.id}>
                <Flex column align='stretch'>
                    <Keyboard keyboard={keyboard}/>
                    {patchUsages.map((patchUsage, index) => {
                        const { patchId } = patchUsage
                        const patch = _.find(data.patches, { id: patchId })
                        const selected = selectedPatchUsage === patchUsage
                        return <div key={index}>
                            <ButtonLike style={styles.patchUsage({ selected, keyboard, patchUsage })}
                                 onClick={() => setSelectedPatchUsage(patchUsage)}>
                                {patch.name}
                            </ButtonLike>
                        </div>
                    })}
                </Flex>
            </Center>
        })}
    </Container>
}

export default PatchUsageDisplay
