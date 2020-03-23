import React from 'react'
import { Container } from '../../../components/Layout'

import PatchSelector from './PatchSelector'
import RangeSelector from './RangeSelector'


class PatchUsageEditor extends React.Component {
    render() {
        const { patchUsage, data, setData } = this.props

        return (
            <Container alt collapse header='Configure Patch'>
                <PatchSelector {...{ patchUsage, data, setData }}/>
                <RangeSelector {...{ patchUsage, data, setData }}/>
            </Container>
        )
    }
}

export default PatchUsageEditor
