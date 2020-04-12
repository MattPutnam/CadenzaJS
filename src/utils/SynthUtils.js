import _ from 'lodash'

import * as Expansions from '../synthesizers/expansions'
import * as GM from '../synthesizers/GM.json'
import * as Synthesizers from '../synthesizers/synthesizers'

const GMTree = GM.default
const GM1Patches = GMTree.map((topLevel, index) => ({
    name: topLevel[0],
    number: index
}))
const GM2Patches = _.flatMap(GMTree, (topLevel, index) => {
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
                if (bank.special === 'GM1' || bank.special === 'GM') {
                    synthItem.banks.push({
                        name: 'GM',
                        patches: GM1Patches
                    })
                    allPatches.push.apply(allPatches, GM1Patches.map(({ name, number }) => ({
                        synthesizer: synth.name,
                        synthesizerId: synth.id,
                        bank: 'GM',
                        number, name
                    })))
                } else if (bank.special === 'GM2') {
                    synthItem.banks.push({
                        name: 'GM2',
                        patches: GM2Patches
                    })
                    allPatches.push.apply(allPatches, GM2Patches.map(({ name, number }) => ({
                        synthesizer: synth.name,
                        synthesizerId: synth.id,
                        bank: 'GM2',
                        number, name
                    })))
                }
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
            const [slotName, expansionName] = expansion
            const expansionType = _.find(synthDefinition.expansions, { name: slotName }).type
            const expansionDefinition = Expansions.getExpansionByTypeAndName(expansionType, expansionName)
            
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