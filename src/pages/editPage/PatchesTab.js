import React from 'react'
import _ from 'lodash'
import { FaPlus } from 'react-icons/fa'

import PatchSelector from './patchesTab/PatchSelector'

import Button from '../../components/Button'
import Container, { ContainerButton } from '../../components/Container'
import Colors from '../../components/colors'
import { Flex } from '../../components/Flex'

import * as Expansions from '../../synthesizers/expansions'
import * as Synthesizers from '../../synthesizers/synthesizers'


const transformPatches = patches => patches.map((name, number) => ({ name, number }))

class PatchesTab extends React.Component {
    constructor(props) {
        super(props)

        const { synthesizers } = props.data.setup
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
        const { style } = this.props

        return <Flex align='stretch' style={style}>
            {this.patchList()}
            {this.editPane()}
        </Flex>
    }

    patchList() {
        const { data } = this.props
        const { patches } = data

        const { selectedPatchId } = this.state

        const buttons = [
            <ContainerButton key={0}><FaPlus/></ContainerButton>
        ]

        const styles = {
            patch: selected => ({
                padding: '0.5rem',
                alignSelf: 'stretch',
                fontWeight: selected ? 'bold' : undefined,
                backgroundColor: selected ? Colors.blue : undefined,
                color: selected ? 'white' : undefined,
                borderBottom: '1px solid black',
                cursor: 'pointer'
            })
        }

        return <Container title='Patches' flex='0 0 200px' buttons={buttons}>
            {patches.map(patch => {
                const { name, id } = patch
                const selected = selectedPatchId === id
                return <div key={id}
                            style={styles.patch(selected)}
                            onClick={() => this.setState({ selectedPatchId: id })}>
                    {name}
                </div>
            })}
        </Container>
    }

    editPane() {
        const { data } = this.props
        const { patches, setup: { synthesizers } } = data

        const { selectedPatchId } = this.state

        let content
        if (selectedPatchId !== undefined) {
            const selectedPatch = _.find(patches, { id: selectedPatchId })
            const selectedSynth = _.find(synthesizers, { id: selectedPatch.synthesizerId })

            content = <>
                <PatchSelector key={selectedPatchId}
                               selectedSynth={selectedSynth}
                               selectedPatch={selectedPatch}
                               allSynths={synthesizers}
                               synthTree={this.synthTree}
                               allPatches={this.allPatches}/>
                <Container inner flex='none' title='Name'>
                    <Flex pad>
                        <input type='text'/>
                        <Button>Use default</Button>
                    </Flex>
                </Container>
                </>
        } else {
            if (_.isEmpty(patches)) {
                content = <div>No patches defined. Click the '+' icon to add one</div>
            } else {
                content = <div>Select a patch to edit it</div>
            }
        }

        return <Container title='Edit'>{content}</Container>
    }
}

export default PatchesTab
