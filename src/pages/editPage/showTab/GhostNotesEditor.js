import React from 'react'
import _ from 'lodash'

import { Checkbox } from '../../../components/Components'
import Keyboard from '../../../components/Keyboard'
import { Center, Flex, Spacer } from '../../../components/Layout'

import { createSubKeyboard } from '../../../utils/KeyboardUtils'


const GhostNotesEditor = ({ patchUsage, data, setData }) => {
    const [selectedKey, setSelectedKey] = React.useState(undefined)

    const updateMapping = key => {
        if (selectedKey) {
            let mapping = patchUsage.attributes.mapping
            if (!mapping) {
                mapping = {}
                patchUsage.attributes.mapping = mapping
            }
    
            let mappingForSelectedKey = mapping[selectedKey]
            if (!mappingForSelectedKey) {
                mappingForSelectedKey = []
                mapping[selectedKey] = mappingForSelectedKey
            }
    
            if (mappingForSelectedKey.includes(key)) {
                const newValue = _.reject(mappingForSelectedKey, x => x === key)
                if (_.isEmpty(newValue)) {
                    delete mapping[selectedKey]
                } else {
                    mapping[selectedKey] = newValue
                }
            } else {
                mappingForSelectedKey.push(key)
            }
    
            setData('change ghost note mapping')
        }
    }

    const setPassthrough = passthrough => {
        patchUsage.attributes.passthrough = passthrough
        setData('set ghost note passthrough')
    }

    const keyboard = _.find(data.setup.keyboards, { id: patchUsage.keyboardId })
    const subKeyboard = createSubKeyboard(keyboard, patchUsage)

    const attributes = patchUsage.attributes || {}
    const highlightKeys = _.get(attributes, `mapping[${selectedKey}]`)
    const lightHighlightKeys = _.keys(attributes.mapping).map(x => parseInt(x))
    const passthrough = attributes.passthrough

    return (
        <Center pad>
            <Flex column>
                When this note is pressed:
                <Flex>
                    <Spacer width={subKeyboard.offsetLeft}/>
                    <Keyboard keyboard={subKeyboard.keyboard}
                              highlightMidi={false}
                              highlightKeys={[selectedKey]}
                              lightHighlightKeys={lightHighlightKeys}
                              onKeyClick={setSelectedKey}/>
                </Flex>
                Sound these notes:
                <Keyboard keyboard={keyboard}
                          highlightMidi={false}
                          highlightKeys={highlightKeys}
                          onKeyClick={updateMapping}/>
                <Checkbox label='Pass through non-mapped notes' checked={!!passthrough} onChange={setPassthrough}/>
            </Flex>
        </Center>
    )
}

export default GhostNotesEditor
