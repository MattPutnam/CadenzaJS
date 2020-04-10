import React from 'react'
import _ from 'lodash'

import PatchNamer from './patchesTab/PatchNamer'
import Volume from './patchesTab/Volume'

import { Placeholder } from '../../components/Components'
import { Container, Header, HeaderButton, Title } from '../../components/Container'
import ControlMapper from '../../components/ControlMapper'
import Icons from '../../components/Icons'
import { Flex } from '../../components/Layout'
import { List, ListItem } from '../../components/List'
import PatchPicker from '../../components/PatchPicker'
import Transpose from '../../components/Transpose'

import { findId } from '../../utils/IdFinder'
import { resolveSynthesizersAndPatches } from '../../utils/SynthUtils'


class PatchesTab extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            selectedPatchId: undefined
        }
    }

    render() {
        const style = {
            flex: '1 1 auto',
            overflow: 'hidden'
        }

        return (
            <Flex align='stretch' style={style}>
                {this.patchList()}
                {this.editPane()}
            </Flex>
        )
    }

    patchList() {
        const { data } = this.props
        const { patches, setup: { synthesizers } } = data

        const { selectedPatchId } = this.state

        return (
            <Container flex='0 0 200px'>
                <Header>
                    <Title>Patches</Title>
                    <HeaderButton icon={Icons.sortDown} disabled={_.isEmpty(patches)} onClick={() => this.sortPatches()}/>
                    <HeaderButton icon={Icons.add} disabled={_.isEmpty(synthesizers)} onClick={() => this.addPatch()}/>
                </Header>
                <List selectedItem={selectedPatchId} setSelectedItem={id => this.setState({ selectedPatchId: id })}>
                    {patches.map(patch => {
                        return <ListItem key={patch.id} value={patch.id}>{patch.name || '<Untitled>'}</ListItem>
                    })}
                </List>
            </Container>
        )
    }

    editPane() {
        const { data, setData } = this.props
        const { patches, setup: { synthesizers } } = data

        const { selectedPatchId } = this.state
        const exists = _.some(patches, { id: selectedPatchId })

        const { synthTree, allPatches } = resolveSynthesizersAndPatches(synthesizers)

        if (exists) {
            const selectedPatch = _.find(patches, { id: selectedPatchId })
            const selectedSynth = _.find(synthesizers, { id: selectedPatch.synthesizerId })

            const initialSelection = [
                selectedSynth ? selectedSynth.name : synthesizers[0].name,
                selectedPatch ? selectedPatch.bank : undefined,
                selectedPatch ? selectedPatch.number : undefined
            ]

            const deleteDisabled = _.some(data.show.cues, cue => {
                return _.some(cue.patchUsages, patchUsage => {
                    return patchUsage.patchId === selectedPatchId
                })
            })

            const onPatchSelected = ([selectedSynthName, selectedBankName, selectedNumber]) => {
                selectedPatch.synthesizerId = _.find(synthesizers, { name: selectedSynthName }).id
                selectedPatch.bank = selectedBankName
                selectedPatch.number = selectedNumber

                if (_.isEmpty(selectedPatch.name)) {
                    const patch = _.find(allPatches, _.pick(selectedPatch, ['synthesizerId', 'bank', 'number']))
                    selectedPatch.name = patch.name
                }

                setData('set patch definition')
            }

            return (
                <Container key={selectedPatchId}>
                    <Header>
                        <Title>Edit</Title>
                        <HeaderButton icon={Icons.delete} onClick={() => this.deleteSelectedPatch()} disabled={deleteDisabled}/>
                        <HeaderButton icon={Icons.clone} onClick={() => this.cloneSelectedPatch()}/>
                    </Header>
                    <Flex style={{height: '100%'}}>
                        <Flex column style={{flex: '1 1 auto'}}>
                            <Container alt>
                                <Header>
                                    <Title>Assignment</Title>
                                </Header>
                                <PatchPicker {...{ synthesizers, initialSelection, synthTree, allPatches, onPatchSelected }}/>
                            </Container>
                            <PatchNamer {...{ selectedPatch, allPatches, setData }}/>
                            <Transpose alt object={selectedPatch} setData={setData}/>
                            <ControlMapper alt object={selectedPatch} setData={setData}/>
                        </Flex>
                        <Volume selectedPatch={selectedPatch} setData={setData}/>
                    </Flex>
                </Container>
            )
        } else {
            if (_.isEmpty(synthesizers)) {
                return <Placeholder>No synthesizers defined. Go to the Setup tab and define a synthesizer.</Placeholder>
            } else if (_.isEmpty(patches)) {
                return <Placeholder>No patches defined. Click the '+' button to add one.</Placeholder>
            } else {
                return <Placeholder>Select a patch to edit it</Placeholder>
            }
        }
    }

    addPatch() {
        const { data, setData } = this.props
        const { patches, setup: { synthesizers } } = data

        const id = findId(patches)
        const synthesizerId = synthesizers[0].id

        patches.push({
            id,
            synthesizerId,
            name: '',
            volume: 100
        })
        setData('add patch')
        this.setState({ selectedPatchId: id })
    }

    cloneSelectedPatch() {
        const { data, setData } = this.props
        const { patches } = data
        const { selectedPatchId } = this.state

        const selectedPatch = _.find(patches, { id: selectedPatchId })

        const id = findId(patches)
        const match = /(.*)\s\(\d+\)/.exec(selectedPatch.name)
        const baseName = match ? match[1] : selectedPatch.name
        let nameNumber = 0
        let name = ''
        const allNames = new Set(_.map(patches, 'name'))
        do {
            nameNumber++
            name = `${baseName} (${nameNumber})`
        } while (allNames.has(name))

        patches.push({
            id,
            synthesizerId: selectedPatch.synthesizerId,
            bank: selectedPatch.bank,
            number: selectedPatch.number,
            name,
            volume: selectedPatch.volume
        })
        setData('clone patch')
        this.setState({ selectedPatchId: id })
    }

    sortPatches() {
        const { data, setData } = this.props
        const { patches } = data

        data.patches = _.sortBy(patches, 'name')
        setData('sort patches')
    }

    deleteSelectedPatch() {
        const { data, setData } = this.props
        const { selectedPatchId } = this.state
        _.remove(data.patches, { id: selectedPatchId })
        setData('delete patch')
        this.setState({ selectedPatchId: undefined })
    }
}

export default PatchesTab
