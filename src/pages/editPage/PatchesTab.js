import React from 'react'
import _ from 'lodash'

import PatchEditor from './patchesTab/PatchEditor'
import PatchList from './patchesTab/PatchList'

import { Placeholder } from '../../components/Components'
import { Flex } from '../../components/Layout'


const PatchesTab = ({ data, setData } ) => {
    const { patches, setup: { synthesizers } } = data

    const [selectedPatchId, setSelectedPatchId] = React.useState(undefined)

    const patchSelected = _.some(patches, { id: selectedPatchId })
    const getPlaceholder = () => {
        if (_.isEmpty(synthesizers)) {
            return <Placeholder>No synthesizers defined. Go to the Setup tab and define a synthesizer.</Placeholder>
        } else if (_.isEmpty(patches)) {
            return <Placeholder>No patches defined. Click the '+' button to add one.</Placeholder>
        } else {
            return <Placeholder>Select a patch to edit it</Placeholder>
        }
    }

    const style = {
        flex: '1 1 auto',
        overflow: 'hidden'
    }

    return (
        <Flex align='stretch' style={style}>
            <PatchList {...{ selectedPatchId, setSelectedPatchId, data, setData }}/>
            {patchSelected && <PatchEditor {...{ selectedPatchId, setSelectedPatchId, data, setData }}/>}
            {!patchSelected && getPlaceholder()}
        </Flex>
    )
}

export default PatchesTab
