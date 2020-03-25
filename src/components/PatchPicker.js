import React from 'react'
import _ from 'lodash'
import { FaCaretRight } from 'react-icons/fa'

import Colors from './colors'
import { Container, Flex, Spacer } from './Layout'


const PatchPicker = ({ alt, synthTree, allPatches, initialSelection=[], onPatchSelected, style }) => {
    const [selection, setSelection] = React.useState(initialSelection)

    const [selectedSynthName, selectedBankName, selectedNumber] = selection
    const resolvedSynth = _.find(synthTree, { name: selectedSynthName })
    const banks = resolvedSynth ? resolvedSynth.banks : undefined

    const bank = banks && selectedBankName ? _.find(banks, { name: selectedBankName }) : {
        name: 'placeholder',
        options: []
    }

    const updateSelection = ([synth, bank, number]) => {
        setSelection([synth, bank, number])
        onPatchSelected([synth, bank, number])
    }
    
    const myStyle = {
        overflowY: 'hidden',
        height: '100%',
        ...style
    }

    return (
        <Flex align='stretch' style={myStyle}>
            <Selection options={synthTree}
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
                       onChange={newNumber => updateSelection([selectedSynthName, selectedBankName, newNumber])}/>
            <SearchSection alt={alt}
                           allPatches={allPatches}
                           selectedPatch={selection}
                           setSelectedPatch={selection => updateSelection([selection.synthesizer, selection.bank, selection.number])}/>
        </Flex>
    )
}

export default PatchPicker


const Selection = ({ options, selected, onChange, selectionTransform=(x => x.name), render=(x => x.name), terminal }) => {
    const styles = {
        container: {
            flex: '0 1 250px',
            borderRight: '1px solid black',
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

    return (
        <div style={styles.container}>
            {options && options.map(option => {
                const isSelected = _.isEqual(selected, selectionTransform(option))
                return (
                    <Flex key={selectionTransform(option)}
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
                )
            })}
        </div>
    )
}

const SearchSection = ({ allPatches, selectedPatch, setSelectedPatch, alt }) => {
    const [searchText, setSearchText] = React.useState('')

    const styles = {
        searchField: {
            flex: '0 1 300px'
        },
        list: {
            alignSelf: 'stretch',
            padding: '0.25rem',
            overflowY: 'auto'
        },
        table: {
            borderCollapse: 'collapse'
        },
        tr: selected => ({
            cursor: 'pointer',
            backgroundColor: selected ? Colors.blue : undefined
        }),
        nameColumn: {
            width: '99%'
        },
        otherColumn: {
            whiteSpace: 'nowrap'
        }
    }

    const arrowColumn = <td><FaCaretRight/></td>

    const searchField = <input type='search'
                               style={styles.searchField}
                               value={searchText}
                               placeholder='Search...'
                               onChange={e => setSearchText(e.target.value)}/>

    const displayResults = !_.isEmpty(searchText)
    const txt = searchText.trim().toLowerCase()
    const results = displayResults && allPatches.filter(patch => patch.name.toLowerCase().indexOf(txt) !== -1)

    return (
        <Container alt={alt} header={searchField}>
            {displayResults && <div key={searchText} style={styles.list}>
                <table style={styles.table}>
                    <tbody>{results.map(patch => {
                        const key = `${patch.name}#${patch.synthesizer}#${patch.bank}`
                        const selected = _.isEqual(selectedPatch, [patch.synthesizer, patch.bank, patch.number])

                        return (
                            <tr key={key} style={styles.tr(selected)} onClick={() => setSelectedPatch(patch)}>
                                <td style={styles.nameColumn}>{patch.name}</td>
                                <td style={styles.otherColumn}>{patch.synthesizer}</td>
                                {arrowColumn}
                                <td style={styles.otherColumn}>{patch.bank}</td>
                                {arrowColumn}
                                <td style={styles.otherColumn}>{patch.number}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>}
        </Container>
    )
}