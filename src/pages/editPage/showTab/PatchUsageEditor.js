import React from 'react'
import _ from 'lodash'

import GhostNotesEditor from './GhostNotesEditor'
import HarpPedalsEditor from './HarpPedalsEditor'
import NormalEditor from './NormalEditor'
import PatchSelector from './PatchSelector'
import RangeSelector from './RangeSelector'

import { Container, Header, HeaderButton, Title } from '../../../components/Container'
import ControlMapper from '../../../components/ControlMapper'
import Icons from '../../../components/Icons'
import { Tab, TabList, TabPanel, Tabs } from '../../../components/Tabs'


const typeToIndex = {
    'normal': 0,
    'ghostNotes': 1,
    'harpPedals': 2
}

const indexToType = [
    'normal',
    'ghostNotes',
    'harpPedals'
]

const PatchUsageEditor = ({ patchUsage, data, setData, deleteSelf, cue }) => {
    const selectedTab = typeToIndex[patchUsage.attributes.type]
    const onTabSelected = index => {
        patchUsage.attributes.type = indexToType[index]
        setData('set patch assignment type')
    }

    const index = _.findIndex(cue.patchUsages, patchUsage)

    return (
        <Container alt collapse>
            <Header>
                <Title>Configure Patch</Title>
                <HeaderButton icon={Icons.delete} onClick={deleteSelf}/>
            </Header>
            <PatchSelector {...{ patchUsage, data, setData }}/>
            <RangeSelector {...{ patchUsage, data, setData }}/>
            <Container collapse>
                <Header>
                    <Title>Type</Title>
                </Header>
                <Tabs key={index} selectedTab={selectedTab} onTabSelected={onTabSelected}>
                    <TabList>
                        <Tab>Normal</Tab>
                        <Tab>Ghost Notes</Tab>
                        <Tab>Harp Pedals</Tab>
                    </TabList>
                    <TabPanel>
                        <NormalEditor {...{ patchUsage, setData }}/>
                    </TabPanel>
                    <TabPanel>
                        <GhostNotesEditor {...{ patchUsage, data, setData }}/>
                    </TabPanel>
                    <TabPanel>
                        <HarpPedalsEditor {...{ patchUsage, setData }}/>
                    </TabPanel>
                </Tabs>
            </Container>
            <ControlMapper object={patchUsage} setData={setData}/>
        </Container>
    )
}

export default PatchUsageEditor
