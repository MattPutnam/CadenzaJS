import React from 'react'
import _ from 'lodash'

import PatchNamer from './PatchNamer'
import Volume from './Volume'

import { Warning } from '../../../components/Components'
import { Container, Header, HeaderButton, Title } from '../../../components/Container'
import ControlMapper from '../../../components/ControlMapper'
import Icons from '../../../components/Icons'
import { Flex } from '../../../components/Layout'
import MidiListener from '../../../components/MidiListener'
import PatchPicker from '../../../components/PatchPicker'
import Transpose from '../../../components/Transpose'

import { findId } from '../../../utils/IdFinder'
import * as SynthUtils from '../../../utils/SynthUtils'
import * as Midi from '../../../utils/Midi'


const PatchEditor = ({ selectedPatchId, setSelectedPatchId, midiInterfaces, data, setData }) => {
    const { patches, setup: { synthesizers } } = data

    const { synthTree, allPatches } = SynthUtils.resolveSynthesizersAndPatches(synthesizers)

    const selectedPatch = _.find(patches, { id: selectedPatchId })
    const patchAssigned = selectedPatch.synthesizerId !== undefined && selectedPatch.bank && selectedPatch.number !== undefined
    const selectedSynth = _.find(synthesizers, { id: selectedPatch.synthesizerId })
    const outputDevice = Midi.findInterfaceByName(midiInterfaces.outputs, selectedSynth.midiInterfaceName)
    const channelToUse = selectedSynth.channels[0]

    const initialSelection = [
        selectedSynth ? selectedSynth.name : synthesizers[0].name,
        selectedPatch ? selectedPatch.bank : undefined,
        selectedPatch ? selectedPatch.number : undefined
    ]

    const deleteDisabled = _.some(data.show.cues, cue => {
        return _.some(cue.patchUsages, patchUsage => {
            return patchUsage.patchId === selectedPatchId
        })
    })

    const onPatchSelected = ([selectedSynthName, selectedBankName, selectedNumber]) => {
        selectedPatch.synthesizerId = _.find(synthesizers, { name: selectedSynthName }).id
        selectedPatch.bank = selectedBankName
        selectedPatch.number = selectedNumber

        if (_.isEmpty(selectedPatch.name)) {
            const patch = _.find(allPatches, _.pick(selectedPatch, ['synthesizerId', 'bank', 'number']))
            selectedPatch.name = patch.name
        }

        setData('set patch definition')
    }

    const deleteSelectedPatch = () => {
        _.remove(data.patches, { id: selectedPatchId })
        setData('delete patch')
        setSelectedPatchId(undefined)
    }

    const cloneSelectedPatch = () => {
        const id = findId(patches)
        const match = /(.*)\s\(\d+\)/.exec(selectedPatch.name)
        const baseName = match ? match[1] : selectedPatch.name
        let nameNumber = 0
        let name = ''
        const allNames = new Set(_.map(patches, 'name'))
        do {
            nameNumber++
            name = `${baseName} (${nameNumber})`
        } while (allNames.has(name))

        const newPatch = _.cloneDeep(selectedPatch)
        newPatch.id = id
        newPatch.name = name

        patches.push(newPatch)
        setData('clone patch')
        setSelectedPatchId(id)
    }

    React.useEffect(() => {
        if (outputDevice && patchAssigned) {
            SynthUtils.loadPatch(selectedPatch, selectedSynth, channelToUse, outputDevice)
        }
    }, [outputDevice, selectedPatch, selectedPatch.bank, selectedPatch.number, selectedSynth, channelToUse, patchAssigned])

    React.useEffect(() => {
        if (outputDevice && patchAssigned) {
            outputDevice.send(Midi.setVolumeMessage(channelToUse, selectedPatch.volume))
        }
    }, [outputDevice, channelToUse, selectedPatch.volume, patchAssigned])

    const handleMidi = parsedMessage => {
        if (patchAssigned) {
            const { type, controller } = parsedMessage
            const { transpose, mappings } = selectedPatch

            if (transpose && (type === Midi.NOTE_ON || type === Midi.NOTE_OFF)) {
                parsedMessage.note = parsedMessage.note + transpose
            }

            if (mappings && type === Midi.CONTROL) {
                const mapped = mappings[controller]
                if (mapped) {
                    parsedMessage.controller = mapped
                }
            }

            parsedMessage.channel = channelToUse
            outputDevice.send(Midi.unparse(parsedMessage))
        }
    }

    return (
        <Container>
            <Header>
                <Title>Edit</Title>
                <HeaderButton icon={Icons.clone} onClick={cloneSelectedPatch}/>
                <HeaderButton icon={Icons.delete} onClick={deleteSelectedPatch} disabled={deleteDisabled}/>
            </Header>
            {outputDevice && <MidiListener id={`PatchEditor#${selectedPatchId}`} dispatch={handleMidi}/>}
            <Flex style={{height: '100%'}}>
                <Flex column style={{flex: '1 1 auto'}}>
                    <Container alt>
                        <Header>
                            <Title>Assignment</Title>
                            {!outputDevice && <Warning>Interface not found</Warning>}
                        </Header>
                        <PatchPicker {...{ synthesizers, initialSelection, synthTree, allPatches, onPatchSelected }}/>
                    </Container>
                    <PatchNamer {...{ selectedPatch, allPatches, setData }}/>
                    <Transpose alt object={selectedPatch} setData={setData}/>
                    <ControlMapper alt object={selectedPatch} setData={setData}/>
                </Flex>
                <Volume selectedPatch={selectedPatch} setData={setData}/>
            </Flex>
        </Container>
    )
}

export default PatchEditor
