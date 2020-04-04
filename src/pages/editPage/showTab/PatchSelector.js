import React from 'react'
import _ from 'lodash'

import { Button, Select } from '../../../components/Components'
import { Container, Header, Title } from '../../../components/Container'
import { Flex } from '../../../components/Layout'
import PatchPicker from '../../../components/PatchPicker'

import { findId } from '../../../utils/IdFinder'
import { resolveSynthesizersAndPatches } from '../../../utils/SynthUtils'


class PatchSelector extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            definingNew: false,
            selectedPatch: undefined
        }

        const { synthTree, allPatches } = resolveSynthesizersAndPatches(props.data.setup.synthesizers)
        this.synthTree = synthTree
        this.allPatches = allPatches
    }

    render() {
        const { patchUsage, data } = this.props
        const { definingNew, selectedPatch } = this.state

        const options = [{ id: -1, name: 'Select...' }, ...data.patches]

        const firstSynth = data.setup.synthesizers[0].name
        const onPatchSelected = selectedPatch => this.setState({ selectedPatch })

        return (
            <Container>
                <Header>
                    <Title>Patch</Title>
                </Header>
                <Flex pad>
                    <Select options={options}
                            selected={patchUsage.patchId}
                            setSelected={newId => this.setPatch(parseInt(newId, 10))}
                            valueRender={p => p.id}
                            render={p => p.name}/>
                    {!definingNew && <Button onClick={() => this.setState({ definingNew: true })}>Create new...</Button>}
                    {definingNew && <Button onClick={() => this.setState({ definingNew: false, selectedPatch: undefined })}>Cancel</Button>}
                    {selectedPatch && <Button onClick={() => this.createNew()}>Confirm</Button>}
                </Flex>
                {definingNew && <PatchPicker alt
                                             style={{maxHeight: '200px', borderTop: '1px solid black'}}
                                             synthTree={this.synthTree}
                                             allPatches={this.allPatches}
                                             initialSelection={[firstSynth]}
                                             onPatchSelected={onPatchSelected}/>}
            </Container>
        )
    }

    setPatch(newId) {
        const { patchUsage, setData } = this.props
        patchUsage.patchId = newId
        setData('change patch assignment patch')
    }

    createNew() {
        this.setState({ definingNew: false, selectedPatch: undefined })

        const { data } = this.props
        const { patches, setup: { synthesizers } } = data
        const { selectedPatch } = this.state

        const [synthName, bank, number] = selectedPatch
        const newId = findId(patches)
        const synthesizerId = _.find(synthesizers, { name: synthName }).id
        const patch = _.find(this.allPatches, { synthesizerId, bank, number })

        const newPatch = {
            id: newId,
            synthesizerId,
            bank,
            number,
            name: patch.name,
            volume: 100
        }

        patches.push(newPatch)
        this.setPatch(newId)
    }
}

export default PatchSelector
