import React from 'react'
import _ from 'lodash'

import CueLocationEditor from './CueLocationEditor'
import PatchUsageDisplay from './PatchUsageDisplay'
import PatchUsageEditor from './PatchUsageEditor'

import Icons from '../../../components/Icons'
import { Container } from '../../../components/Layout'
import TriggerEditor from '../../../components/TriggerEditor'


const CueEditor = ({ cueId, deleteSelf, data, setData }) => {
    const [selectedPatchUsage, setSelectedPatchUsage] = React.useState(undefined)

    const cue = _.find(data.show.cues, { id: cueId })

    const deleteSelectedPatchUsage = () => {
        _.remove(cue.patchUsages, selectedPatchUsage)
        setData('delete patch assignment')
        setSelectedPatchUsage(undefined)
    }

    const buttons = [{ icon: Icons.delete, onClick: deleteSelf }]

    return (
        <Container header='Edit Cue' buttons={buttons}>
            <CueLocationEditor {...{ cueId, data, setData }}/>
            <PatchUsageDisplay {...{ cue, data, setData, selectedPatchUsage, setSelectedPatchUsage }}/>
            {selectedPatchUsage && <PatchUsageEditor patchUsage={selectedPatchUsage}
                                                     deleteSelf={deleteSelectedPatchUsage}
                                                     {...{ cue, data, setData }}/>}
            <TriggerEditor object={cue} {...{ data, setData }}/>
        </Container>
    )
}

export default CueEditor
