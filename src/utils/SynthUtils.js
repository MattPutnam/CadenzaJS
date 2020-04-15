import _ from 'lodash'

import * as Expansions from '../synthesizers/expansions'
import * as GM from '../synthesizers/GM.json'
import * as Synthesizers from '../synthesizers/synthesizers'

const GM1Patches = GM.default.map((topLevel, index) => ({
    name: topLevel[0],
    number: index
}))
const GM2Patches = _.flatMap(GM.default, (topLevel, index) => {
    return topLevel.map((patch, subIndex) => ({
        name: patch,
        number: [index, subIndex]
    }))
})


const transformPatches = patches => patches.map((name, number) => ({ name, number }))

export const resolveSynthesizersAndPatches = synthesizers => {
    const synthTree = []
    const allPatches = []
    for (let synth of synthesizers) {
        const synthDefinition = Synthesizers.getSynthByName(synth.name)

        const synthItem = {
            name: synth.name,
            banks: []
        }
        
        synthDefinition.banks.forEach(bank => {
            if (bank.special) {
                const patches = bank.special === 'GM2' ? GM2Patches : GM1Patches
                synthItem.banks.push({
                    name: bank.special,
                    patches: patches
                })
                allPatches.push.apply(allPatches, patches.map(({ name, number }) => ({
                    synthesizer: synth.name,
                    synthesizerId: synth.id,
                    bank: bank.special,
                    number, name
                })))
            } else {
                synthItem.banks.push({
                    name: bank.name,
                    patches: transformPatches(bank.patches)
                })
                allPatches.push.apply(allPatches, bank.patches.map((patch, index) => ({
                    synthesizer: synth.name,
                    synthesizerId: synth.id,
                    bank: bank.name,
                    number: index,
                    name: patch
                })))
            }
        })

        for (let expansion of _.toPairs(synth.expansionCards)) {
            const [slotName, expansionNumber] = expansion
            const expansionType = _.find(synthDefinition.expansions, { name: slotName }).type
            const expansionDefinition = Expansions.getExpansionByTypeAndNumber(expansionType, expansionNumber)
            
            synthItem.banks.push({
                name: slotName,
                patches: transformPatches(expansionDefinition.patches)
            })
            allPatches.push.apply(allPatches, expansionDefinition.patches.map((patch, index) => ({
                synthesizer: synth.name,
                synthesizerId: synth.id,
                bank: slotName,
                number: index,
                name: patch
            })))
        }

        synthTree.push(synthItem)
    }

    return { synthTree, allPatches }
}


export const getLoadCommand = (patch, synthesizer) => {
    if (patch.bank === 'GM' || patch.bank === 'GM1') {
        return [
            { type: 'CC', number: 0, value: 121 },
            { type: 'CC', number: 32, value: 0},
            { type: 'PC' }
        ]
    } else if (patch.bank === 'GM2') {
        const [pc, cc] = patch.number
        return [
            { type: 'CC', number: 0, value: 121 },
            { type: 'CC', number: 32, value: cc },
            { type: 'PC', value: pc }
        ]
    }

    const synthDefinition = Synthesizers.getSynthByName(synthesizer.name)
    const banksAndExps = [...synthDefinition.banks, ...synthDefinition.expansions]
    const { toSelect } = _.find(banksAndExps, { name: patch.bank })

    let selectors
    if (toSelect === 'SELECT_BY_CARD') {
        const expansionCard = synthesizer.expansionCards[patch.bank]
        selectors = synthDefinition.cardSelectors[expansionCard]
    } else {
        selectors = toSelect
    }

    if (selectors.length === 1) {
        return selectors[0].commands
    } else {
        return _.find(selectors, selector => {
            const rangeHigh = selector.rangeHigh || Infinity
            const rangeLow = selector.rangeLow || -Infinity
            return rangeLow <= patch.number && patch.number <= rangeHigh
        }).commands
    }
}
