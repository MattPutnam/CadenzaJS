import React from 'react'
import _ from 'lodash'

import Colors from './Colors'
import { Container, Header } from './Container'
import Icons, { icon } from './Icons'
import { Flex, Spacer } from './Layout'


const PatchPicker = ({ alt, synthTree, allPatches, initialSelection=[], onPatchSelected, style }) => {
    const [selection, setSelection] = React.useState(initialSelection)
    React.useEffect(() => {
        setSelection(initialSelection)
    }, [initialSelection])

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

    const renderPatch = patch => {
        let patchNumber
        if (bank.name === 'GM2') {
            const [b1, b2] = patch.number
            patchNumber = `${b1+1}.${b2+1}`
        } else {
            patchNumber = patch.number + (bank.index === undefined ? 1 : bank.index)
        }

        const styles = {
            container: {
                width: '100%'
            },
            name: {
                flex: '1 1 auto',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
            },
            number: {
                flex: '0 0 auto',
                marginLeft: '0.5rem'
            }
        }

        return (
            <Flex style={styles.container}>
                <span style={styles.name}>{patch.name}</span>
                <span style={styles.number}>{patchNumber}</span>
            </Flex>
        )
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
                       render={renderPatch}
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
            backgroundColor: isSelected ? Colors.blue[2] : undefined
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
                            {icon(Icons.treeSeparator, { align: 'center' })}
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
            backgroundColor: selected ? Colors.blue[2] : undefined
        }),
        nameColumn: {
            width: '99%'
        },
        otherColumn: {
            whiteSpace: 'nowrap'
        }
    }

    const arrowColumn = <td>{icon(Icons.treeSeparator)}</td>

    const displayResults = !_.isEmpty(searchText)
    const txt = searchText.trim().toLowerCase()
    const results = displayResults && allPatches.filter(patch => patch.name.toLowerCase().indexOf(txt) !== -1)

    return (
        <Container alt={alt}>
            <Header>
                <input type='search'
                       style={styles.searchField}
                       value={searchText}
                       placeholder='Search...'
                       onChange={e => setSearchText(e.target.value)}/>
            </Header>
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