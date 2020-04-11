import React from 'react'
import _ from 'lodash'

import { Container, Header, HeaderButton, Title } from '../../../components/Container'
import Icons from '../../../components/Icons'
import { List, ListItem } from '../../../components/List'

import { findId } from '../../../utils/IdFinder'


const PatchList = ({ selectedPatchId, setSelectedPatchId, data, setData }) => {
    const { patches, setup: { synthesizers } } = data

    const sortPatches = () => {
        data.patches = _.sortBy(patches, 'name')
        setData('sort patches')
    }

    const addPatch = () => {
        const id = findId(patches)
        const synthesizerId = synthesizers[0].id

        patches.push({
            id,
            synthesizerId,
            name: '',
            volume: 100
        })
        setData('add patch')
        setSelectedPatchId(id)
    }

    return (
        <Container flex='0 0 200px'>
            <Header>
                <Title>Patches</Title>
                <HeaderButton icon={Icons.sortDown} disabled={_.isEmpty(patches)} onClick={sortPatches}/>
                <HeaderButton icon={Icons.add} disabled={_.isEmpty(synthesizers)} onClick={addPatch}/>
            </Header>
            <List selectedItem={selectedPatchId} setSelectedItem={setSelectedPatchId}>
                {patches.map(patch => {
                    return <ListItem key={patch.id} value={patch.id}>{patch.name || '<Untitled>'}</ListItem>
                })}
            </List>
        </Container>
    )
}

export default PatchList
