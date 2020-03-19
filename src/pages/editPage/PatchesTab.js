import React from 'react'
import _ from 'lodash'
import { FaPlus, FaTrash } from 'react-icons/fa'

import Transpose from './patchesTab/Transpose'
import PatchNamer from './patchesTab/PatchNamer'
import PatchSelector from './patchesTab/PatchSelector'
import Volume from './patchesTab/Volume'

import { Placeholder } from '../../components/Components'
import Colors from '../../components/colors'
import { Container, Flex } from '../../components/Layout'

import { findId } from '../../utils/IdFinder'

import * as Expansions from '../../synthesizers/expansions'
import * as Synthesizers from '../../synthesizers/synthesizers'


const transformPatches = patches => patches.map((name, number) => ({ name, number }))

class PatchesTab extends React.Component {
    constructor(props) {
        super(props)

        const { synthesizers } = props.data.setup
        this.noSynths = _.isEmpty(synthesizers)
        this.synthTree = []
        this.allPatches = []
        for (let synth of synthesizers) {
            const synthDefinition = Synthesizers.getSynthByName(synth.name)

            const synthItem = {
                name: synth.name,
                banks: []
            }
            
            for (let bank of synthDefinition.banks) {
                if (bank.special) {
                    // TODO: GM
                } else {
                    synthItem.banks.push({
                        name: bank.name,
                        patches: transformPatches(bank.patches)
                    })
                    this.allPatches = this.allPatches.concat(...bank.patches.map((patch, index) => ({
                        synthesizer: synth.name,
                        synthesizerId: synth.id,
                        bank: bank.name,
                        number: index,
                        name: patch
                    })))
                }
            }

            for (let expansion of _.toPairs(synth.expansionCards)) {
                const [slotName, expansionName] = expansion
                const expansionType = _.find(synthDefinition.expansions, { name: slotName }).type
                const expansionDefinition = Expansions.getExpansionByTypeAndName(expansionType, expansionName)
                
                synthItem.banks.push({
                    name: slotName,
                    patches: transformPatches(expansionDefinition.patches)
                })
                this.allPatches = this.allPatches.concat(...expansionDefinition.patches.map((patch, index) => ({
                    synthesizer: synth.name,
                    synthesizerId: synth.id,
                    bank: slotName,
                    number: index,
                    name: patch
                })))
            }

            this.synthTree.push(synthItem)
        }

        this.state = {
            selectedPatchId: undefined
        }
    }

    render() {
        const style = {
            flex: '1 1 auto',
            overflow: 'hidden'
        }

        return <Flex align='stretch' style={style}>
            {this.patchList()}
            {this.editPane()}
        </Flex>
    }

    patchList() {
        const { data } = this.props
        const { patches } = data

        const { selectedPatchId } = this.state

        const buttons = [{ icon: <FaPlus/>, disabled: this.noSynths, onClick: () => this.addPatch() }]

        const styles = {
            patch: selected => ({
                padding: '0.5rem',
                alignSelf: 'stretch',
                fontWeight: selected ? 'bold' : undefined,
                backgroundColor: selected ? Colors.blue : undefined,
                color: selected ? 'white' : undefined,
                borderBottom: '1px solid black',
                cursor: 'pointer'
            }),
            list: {
                alignSelf: 'stretch',
                overflowY: 'auto'
            }
        }

        return <Container header='Patches' flex='0 0 200px' buttons={buttons}>
            <div style={styles.list}>
                {patches.map(patch => {
                    const { name, id } = patch
                    const selected = selectedPatchId === id
                    return <div key={id}
                                style={styles.patch(selected)}
                                onClick={() => this.setState({ selectedPatchId: id })}>
                        {name || '<Untitled>'}
                    </div>
                })}
            </div>
        </Container>
    }

    editPane() {
        const { data, setData } = this.props
        const { patches, setup: { synthesizers } } = data

        const { selectedPatchId } = this.state

        if (selectedPatchId !== undefined) {
            const selectedPatch = _.find(patches, { id: selectedPatchId })
            const selectedSynth = _.find(synthesizers, { id: selectedPatch.synthesizerId })

            const buttons = [{ icon: <FaTrash/>, onClick: () => this.deleteSelectedPatch() }]

            return <Container header='Edit' buttons={buttons}>
                <Flex style={{height: '100%'}}>
                    <Flex column style={{flex: '1 1 auto'}}>
                        <PatchSelector key={selectedPatchId}
                                       selectedSynth={selectedSynth}
                                       selectedPatch={selectedPatch}
                                       allSynths={synthesizers}
                                       synthTree={this.synthTree}
                                       allPatches={this.allPatches}
                                       setData={setData}/>
                        <PatchNamer selectedPatch={selectedPatch} setData={setData} allPatches={this.allPatches}/>
                        <Transpose selectedPatch={selectedPatch} setData={setData}/>
                    </Flex>
                    <Volume selectedPatch={selectedPatch} setData={setData}/>
                </Flex>
            </Container>
        } else {
            if (this.noSynths) {
                return <Placeholder>No synthesizers defined. Go to the Setup tab and define a synthesizer.</Placeholder>
            } else if (_.isEmpty(patches)) {
                return <Placeholder>No patches defined. Click the '+' icon to add one</Placeholder>
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

    deleteSelectedPatch() {
        const { data, setData } = this.props
        const { selectedPatchId } = this.state
        _.remove(data.patches, { id: selectedPatchId })
        setData()
        this.setState({ selectedPatchId: undefined })
    }
}

export default PatchesTab
