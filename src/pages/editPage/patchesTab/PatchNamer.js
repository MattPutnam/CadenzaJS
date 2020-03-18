import React from 'react'
import _ from 'lodash'

import { Button } from '../../../components/Components'
import { Container, Flex } from '../../../components/Layout'


const PatchNamer = ({ selectedPatch, allPatches, setData }) => {
    const changeName = newName => {
        selectedPatch.name = newName
        setData()
    }
    const useDefaultName = () => {
        const query = _.pick(selectedPatch, ['synthesizerId', 'bank', 'number'])
        const patch = _.find(allPatches, query)
        selectedPatch.name = patch.name
        setData()
    }

    return <Container alt flex='none' header='Name'>
        <Flex pad>
            <input type='text' value={selectedPatch.name} onChange={e => changeName(e.target.value)}/>
            <Button onClick={useDefaultName}>Use default</Button>
        </Flex>
    </Container>
}

export default PatchNamer
