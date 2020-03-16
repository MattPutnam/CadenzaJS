import React from 'react'
import _ from 'lodash'
import { FaCaretRight, FaPlus } from 'react-icons/fa'

import Container, { ContainerButton } from '../../components/Container'
import Colors from '../../components/colors'
import { Flex, Spacer } from '../../components/Flex'

import * as Expansions from '../../synthesizers/expansions'
import * as Synthesizers from '../../synthesizers/synthesizers'


const transformPatches = patches => patches.map((name, number) => ({ name, number }))

class PatchesTab extends React.Component {
    constructor(props) {
        super(props)

        const { synthesizers } = props.data.setup
        this.synthList = []
        this.synthsById = {}
        for (let synth of synthesizers) {
            this.synthsById[synth.id] = synth
            const synthDefinition = Synthesizers.getSynthByName(synth.name)

            const synthItem = {
                name: synth.name,
                banks: []
            }
            
            for (var bank of synthDefinition.banks) {
                if (bank.special) {
                    // TODO: GM
                } else {
                    synthItem.banks.push({
                        name: bank.name,
                        patches: transformPatches(bank.patches)
                    })
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
            }

            this.synthList.push(synthItem)
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
                fontWeight: selected ? 'bold' : undefined,
                backgroundColor: selected ? Colors.blue : undefined,
                color: selected ? 'white' : undefined,
                borderBottom: '1px solid black',
                cursor: 'pointer'
            })
        }

        return <Container title='Patches' flex='0 0 200px' padContent={false} buttons={buttons}>
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

            content = <PatchSelector key={selectedPatchId}
                                     selectedSynth={selectedSynth}
                                     selectedPatch={selectedPatch}
                                     allSynths={synthesizers}
                                     synthList={this.synthList}/>
        } else {
            if (_.isEmpty(patches)) {
                content = <div>No patches defined. Click the '+' icon to add one</div>
            } else {
                content = <div>Select a patch to edit it</div>
            }
        }

        return <Container title='Edit' padContent={false}>{content}</Container>
    }
}

export default PatchesTab


const PatchSelector = ({ selectedSynth, selectedPatch, allSynths, synthList }) => {
    const [selection, setSelection] = React.useState([
        selectedSynth ? selectedSynth.name : allSynths[0].name,
        selectedPatch ? selectedPatch.bank : undefined,
        selectedPatch ? selectedPatch.number : undefined
    ])

    const [selectedSynthName, selectedBankName, selectedNumber] = selection
    const banks = _.find(synthList, { name: selectedSynthName }).banks

    const bank = banks && selectedBankName ? _.find(banks, { name: selectedBankName }) : undefined
    

    return <Container inner title='Assignment' padContent={false}>
        <Flex>
            <Selection options={synthList}
                       selected={selectedSynthName}
                       onChange={newName => setSelection([newName, undefined, undefined])}/>
            <Selection key={selectedSynthName}
                       options={banks}
                       selected={selectedBankName}
                       onChange={newBank => setSelection([selectedSynthName, newBank, undefined])}/>
            <Selection key={bank.name}
                       options={bank.patches}
                       terminal
                       selected={selectedNumber}
                       selectionTransform={x => x.number}
                       render={patch => `${patch.number + (bank.index === undefined ? 1 : bank.index)} ${patch.name}`}
                       onChange={newNumber => setSelection([selectedSynthName, selectedBankName, newNumber])}/>
            <Spacer/>
        </Flex>
    </Container>
}

const Selection = ({ options, selected, onChange, selectionTransform=(x => x.name), render=(x => x.name), terminal }) => {
    const styles = {
        container: {
            flex: '0 1 250px',
            color: 'white',
            borderRight: '1px solid black',
            height: 500,
            overflowY: 'scroll'
        },
        option: isSelected => ({
            cursor: 'pointer',
            fontWeight: 500,
            padding: '0 0.5rem',
            backgroundColor: isSelected ? Colors.blue : undefined
        })
    }

    const scrollRef = React.useRef(null)
    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ block: 'nearest' })
        }
    })

    return <div style={styles.container}>
        {options && options.map(option => {
            const isSelected = _.isEqual(selected, selectionTransform(option))
            return <Flex key={selectionTransform(option)}
                         align='center'
                         ref={isSelected ? scrollRef : undefined}
                         style={styles.option(isSelected)}
                         onClick={isSelected ? undefined : () => onChange(selectionTransform(option))}>
                {render(option)}
                {!terminal && <>
                    <Spacer/>
                    <FaCaretRight align='center'/>
                </>}
            </Flex>
        })}
    </div>
}
