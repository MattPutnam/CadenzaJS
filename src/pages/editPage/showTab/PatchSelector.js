import React from 'react'

import { Select } from '../../../components/Components'
import { Container, Flex } from '../../../components/Layout'


class PatchSelector extends React.Component {
    render() {
        const { patchUsage, data } = this.props

        const options = [{ id: -1, name: 'Select...' }, ...data.patches]

        return (
            <Container header='Patch'>
                <Flex pad>
                    <Select options={options}
                            selected={patchUsage.patchId}
                            setSelected={newId => this.setPatch(newId)}
                            valueRender={p => p.id}
                            render={p => p.name}/>
                </Flex>
            </Container>
        )
    }

    setPatch(newId) {
        const { patchUsage, setData } = this.props
        patchUsage.patchId = parseInt(newId)
        setData()
    }
}

export default PatchSelector
