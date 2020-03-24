import React from 'react'
import _ from 'lodash'
import { FaPlus, FaSortAlphaDown, FaTrash } from 'react-icons/fa'

import PatchNamer from './patchesTab/PatchNamer'
import Volume from './patchesTab/Volume'

import Colors from '../../components/colors'
import { Placeholder } from '../../components/Components'
import { Container, Flex } from '../../components/Layout'
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

        const buttons = [
            { icon: FaSortAlphaDown, disabled: _.isEmpty(patches), onClick: () => this.sortPatches() },
            { icon: FaPlus, disabled: _.isEmpty(synthesizers), onClick: () => this.addPatch() }
        ]

        const styles = {
            list: {
                alignSelf: 'stretch',
                overflowY: 'auto'
            },
            patch: selected => ({
                padding: '0.5rem',
                alignSelf: 'stretch',
                fontWeight: selected ? 'bold' : undefined,
                backgroundColor: selected ? Colors.blue : undefined,
                borderBottom: '1px solid black',
                cursor: 'pointer'
            })
        }

        return (
            <Container header='Patches' flex='0 0 200px' buttons={buttons}>
                <div style={styles.list}>
                    {patches.map(patch => {
                        const { name, id } = patch
                        const selected = selectedPatchId === id
                        return (
                            <div key={id}
                                 style={styles.patch(selected)}
                                 onClick={() => this.setState({ selectedPatchId: id })}>
                                {name || '<Untitled>'}
                            </div>
                        )
                    })}
                </div>
            </Container>
        )
    }

    editPane() {
        const { data, setData } = this.props
        const { patches, setup: { synthesizers } } = data

        const { selectedPatchId } = this.state

        const { synthTree, allPatches } = resolveSynthesizersAndPatches(synthesizers)

        if (selectedPatchId !== undefined) {
            const selectedPatch = _.find(patches, { id: selectedPatchId })
            const selectedSynth = _.find(synthesizers, { id: selectedPatch.synthesizerId })

            const initialSelection = [
                selectedSynth ? selectedSynth.name : synthesizers[0].name,
                selectedPatch ? selectedPatch.bank : undefined,
                selectedPatch ? selectedPatch.number : undefined
            ]

            const disabled = _.some(data.show.songs, song => {
                return _.some(song.cues, cue => {
                    return _.some(cue.patchUsages, patchUsage => {
                        return patchUsage.patchId === selectedPatchId
                    })
                })
            })

            const onPatchSelected = ([selectedSynthName, selectedBankName, selectedNumber]) => {
                selectedPatch.synthesizerId = _.find(synthesizers, { name: selectedSynthName }).id
                selectedPatch.bank = selectedBankName
                selectedPatch.number = selectedNumber
                setData()
            }

            const buttons = [{ icon: FaTrash, onClick: () => this.deleteSelectedPatch(), disabled }]

            return (
                <Container key={selectedPatchId} header='Edit' buttons={buttons}>
                    <Flex style={{height: '100%'}}>
                        <Flex column style={{flex: '1 1 auto'}}>
                            <Container alt header='Assignment'>
                                <PatchPicker {...{ synthesizers, initialSelection, synthTree, allPatches, onPatchSelected }}/>
                            </Container>
                            <PatchNamer {...{ selectedPatch, allPatches, setData }}/>
                            <Transpose alt object={selectedPatch} setData={setData}/>
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
        setData()
        this.setState({ selectedPatchId: id })
    }

    sortPatches() {
        const { data, setData } = this.props
        const { patches } = data

        data.patches = _.sortBy(patches, 'name')
        setData()
    }

    deleteSelectedPatch() {
        const { data, setData } = this.props
        const { selectedPatchId } = this.state
        _.remove(data.patches, { id: selectedPatchId })
        setData()
        this.setState({ selectedPatchId: undefined })
    }
}

export default PatchesTab
