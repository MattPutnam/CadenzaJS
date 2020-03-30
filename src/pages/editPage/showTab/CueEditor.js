import React from 'react'
import _ from 'lodash'

import CueLocationEditor from './CueLocationEditor'
import PatchUsageDisplay from './PatchUsageDisplay'
import PatchUsageEditor from './PatchUsageEditor'

import Icons from '../../../components/Icons'
import { Container } from '../../../components/Layout'
import TriggerEditor from '../../../components/TriggerEditor'


const CueEditor = ({ cueId, deleteSelf, data, setData }) => {
    const [selectedPatchUsageIndex, setSelectedPatchUsageIndex] = React.useState(undefined)

    const cue = _.find(data.show.cues, { id: cueId })
    const selectedPatchUsage = cue.patchUsages[selectedPatchUsageIndex]
    const setSelectedPatchUsage = pu => setSelectedPatchUsageIndex(_.indexOf(cue.patchUsages, pu))

    const deleteSelectedPatchUsage = () => {
        cue.patchUsages.splice(selectedPatchUsageIndex)
        setData('delete patch assignment')
        setSelectedPatchUsageIndex(undefined)
    }

    const buttons = [{ icon: Icons.delete, onClick: deleteSelf }]

    return (
        <Container header='Edit Cue' buttons={buttons}>
            <CueLocationEditor key={`${cue.songId}#${cue.measure}`} {...{ cueId, data, setData }}/>
            <PatchUsageDisplay {...{ cue, data, setData, selectedPatchUsage, setSelectedPatchUsage }}/>
            {selectedPatchUsage && <PatchUsageEditor patchUsage={selectedPatchUsage}
                                                     deleteSelf={deleteSelectedPatchUsage}
                                                     {...{ cue, data, setData }}/>}
            <TriggerEditor object={cue} {...{ data, setData }}/>
        </Container>
    )
}

export default CueEditor
