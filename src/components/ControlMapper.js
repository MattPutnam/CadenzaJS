import React from 'react'
import _ from 'lodash'

import { Button, Placeholder } from './Components'
import ControlSelect from './ControlSelect'
import Icons, { icon } from './Icons'
import { Container, Flex } from './Layout'


const ControlMapper = ({ object, setData, alt }) => {
    const mappings = object.mappings || {}

    const updateKey = (oldKey, newKey) => {
        const value = mappings[oldKey]
        delete mappings[oldKey]
        mappings[newKey] = value

        object.mappings = mappings
        setData('map control')
    }

    const updateValue = (key, newValue) => {
        mappings[key] = newValue

        object.mappings = mappings
        setData('map control')
    }

    const remove = key => {
        delete mappings[key]

        if (_.isEmpty(mappings)) {
            delete object.mappings
        }

        setData('delete map control')
    }

    const addNew = () => {
        let candidate = 0
        while (_.has(mappings, candidate)) {
            candidate++
        }

        updateValue(candidate, candidate)
    }

    const buttons = [{ icon: Icons.add, onClick: addNew }]

    return (
        <Container alt={alt} collapse startCollapsed={_.isEmpty(mappings)} header='Map controls' buttons={buttons}>
            <Flex column pad>
                {_.isEmpty(mappings) && <Placeholder>Click '+' to add a mapping</Placeholder>}
                {_.toPairs(mappings).map(([key, value]) => {
                    return <Flex pad align='center' key={key}>
                        <ControlSelect selected={key} setSelected={newKey => updateKey(key, parseInt(newKey, 10))}/>
                        {icon(Icons.treeSeparator, { style: { marginRight: '0.5rem' } })}
                        <ControlSelect selected={value} setSelected={newValue => updateValue(key, parseInt(newValue, 10))}/>
                        <Button onClick={() => remove(key)}>Delete</Button>
                    </Flex>
                })}
            </Flex>
        </Container>
    )
}

export default ControlMapper
