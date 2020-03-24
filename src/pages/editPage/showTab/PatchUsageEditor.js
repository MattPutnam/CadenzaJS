import React from 'react'
import { FaTrash } from 'react-icons/fa'

import PatchSelector from './PatchSelector'
import RangeSelector from './RangeSelector'

import { Container } from '../../../components/Layout'
import Transpose from '../../../components/Transpose'


class PatchUsageEditor extends React.Component {
    render() {
        const { patchUsage, data, setData, deleteSelf } = this.props

        const buttons = [{ icon: FaTrash, onClick: deleteSelf }]

        return (
            <Container alt collapse header='Configure Patch' buttons={buttons}>
                <PatchSelector {...{ patchUsage, data, setData }}/>
                <RangeSelector {...{ patchUsage, data, setData }}/>
                <Transpose object={patchUsage} setData={setData}/>
            </Container>
        )
    }
}

export default PatchUsageEditor
