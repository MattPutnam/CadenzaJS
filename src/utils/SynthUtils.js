import _ from 'lodash'

import * as Expansions from '../synthesizers/expansions'
import * as Synthesizers from '../synthesizers/synthesizers'


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
                // TODO: GM
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