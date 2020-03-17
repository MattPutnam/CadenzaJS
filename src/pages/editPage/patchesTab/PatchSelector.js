import React from 'react'
import _ from 'lodash'
import { FaCaretRight } from 'react-icons/fa'

import Colors from '../../../components/colors'
import Container from '../../../components/Container'
import { Flex, Spacer } from '../../../components/Flex'


const PatchSelector = ({ selectedSynth, selectedPatch, allSynths, synthTree, allPatches }) => {
    const [selection, setSelection] = React.useState([
        selectedSynth ? selectedSynth.name : allSynths[0].name,
        selectedPatch ? selectedPatch.bank : undefined,
        selectedPatch ? selectedPatch.number : undefined
    ])

    const [selectedSynthName, selectedBankName, selectedNumber] = selection
    const banks = _.find(synthTree, { name: selectedSynthName }).banks

    const bank = banks && selectedBankName ? _.find(banks, { name: selectedBankName }) : undefined
    

    return <Container inner flex='none' title='Assignment'>
        <Flex align='stretch' style={{ height: 500 }}>
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
                       onChange={newNumber => setSelection([selectedSynthName, selectedBankName, newNumber])}/>
            <SearchSection allPatches={allPatches} setSelectedPatch={selection => console.log(selection)}/>
        </Flex>
    </Container>
}

export default PatchSelector


const Selection = ({ options, selected, onChange, selectionTransform=(x => x.name), render=(x => x.name), terminal }) => {
    const styles = {
        container: {
            flex: '0 1 250px',
            color: 'white',
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

const SearchSection = ({ allPatches, setSelectedPatch }) => {
    const [searchText, setSearchText] = React.useState('')

    const styles = {
        searchField: {
            flex: '0 1 300px'
        },
        list: {
            color: 'white',
            alignSelf: 'stretch',
            padding: '0.25rem',
            overflowY: 'auto'
        },
        table: {
            borderCollapse: 'collapse'
        },
        tr: {
            cursor: 'pointer'
        },
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

    return <Container title={searchField}>
        {displayResults && <div key={searchText} style={styles.list}>
            <table style={styles.table}>
                <tbody>{results.map(patch => {
                    const key = `${patch.name}#${patch.synthsizer}#${patch.bank}`
                    return <tr key={key} style={styles.tr}>
                        <td style={styles.nameColumn}>{patch.name}</td>
                        <td style={styles.otherColumn}>{patch.synthesizer}</td>
                        {arrowColumn}
                        <td style={styles.otherColumn}>{patch.bank}</td>
                        {arrowColumn}
                        <td style={styles.otherColumn}>{patch.number}</td>
                    </tr>
                })}
                </tbody>
            </table>
        </div>}
    </Container>
}
