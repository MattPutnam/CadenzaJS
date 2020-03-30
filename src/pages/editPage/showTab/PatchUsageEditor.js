import React from 'react'
import _ from 'lodash'

import GhostNotesEditor from './GhostNotesEditor'
import NormalEditor from './NormalEditor'
import PatchSelector from './PatchSelector'
import RangeSelector from './RangeSelector'

import Icons from '../../../components/Icons'
import { Container } from '../../../components/Layout'
import { Tab, TabList, TabPanel, Tabs } from '../../../components/Tabs'


const typeToIndex = {
    'normal': 0,
    'ghostNotes': 1
}

const indexToType = [
    'normal',
    'ghostNotes'
]

class PatchUsageEditor extends React.Component {
    render() {
        const { patchUsage, data, setData, deleteSelf, cue } = this.props

        const buttons = [{ icon: Icons.delete, onClick: deleteSelf }]

        const selectedTab = typeToIndex[patchUsage.attributes.type]
        const onTabSelected = index => {
            patchUsage.attributes.type = indexToType[index]
            setData('set patch assignment type')
        }

        const index = _.findIndex(cue.patchUsages, patchUsage)

        return (
            <Container alt collapse header='Configure Patch' buttons={buttons}>
                <PatchSelector {...{ patchUsage, data, setData }}/>
                <RangeSelector {...{ patchUsage, data, setData }}/>
                <Container collapse header='Type'>
                    <Tabs key={index} selectedTab={selectedTab} onTabSelected={onTabSelected}>
                        <TabList>
                            <Tab>Normal</Tab>
                            <Tab>Ghost Notes</Tab>
                        </TabList>
                        <TabPanel>
                            <NormalEditor {...{ patchUsage, setData }}/>
                        </TabPanel>
                        <TabPanel>
                            <GhostNotesEditor {...{ patchUsage, data, setData }}/>
                        </TabPanel>
                    </Tabs>
                </Container>
            </Container>
        )
    }
}

export default PatchUsageEditor
