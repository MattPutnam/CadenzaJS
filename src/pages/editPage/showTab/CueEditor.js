import React from 'react'
import _ from 'lodash'
import { FaTrash } from 'react-icons/fa'

import CueLocationEditor from './CueLocationEditor'
import PatchUsageDisplay from './PatchUsageDisplay'
import PatchUsageEditor from './PatchUsageEditor'

import { Container } from '../../../components/Layout'


const CueEditor = ({ song, cue, deleteSelf, data, setData, setParentSong }) => {
    const [selectedPatchUsage, setSelectedPatchUsage] = React.useState(undefined)

    const deleteSelectedPatchUsage = () => {
        _.remove(cue.patchUsages, selectedPatchUsage)
        setData()
        setSelectedPatchUsage(undefined)
    }

    const buttons = [{ icon: FaTrash, onClick: deleteSelf }]

    return (
        <Container header='Edit Cue' buttons={buttons}>
            <CueLocationEditor {...{ song, cue, data, setData, setParentSong }}/>
            <PatchUsageDisplay {...{ cue, data, setData, selectedPatchUsage, setSelectedPatchUsage }}/>
            {selectedPatchUsage && <PatchUsageEditor patchUsage={selectedPatchUsage}
                                                     deleteSelf={deleteSelectedPatchUsage}
                                                     {...{ data, setData }}/>}
        </Container>
    )
}

export default CueEditor
