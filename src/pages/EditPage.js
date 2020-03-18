import React from 'react'

import PatchesTab from './editPage/PatchesTab'
import SetupTab from './editPage/SetupTab'

import { Flex } from '../components/Layout'
import NavBar from '../components/NavBar'


const EditPage = ({ perform, midiInterfaces, data, setData }) => {
    const [selectedTab, setSelectedTab] = React.useState('Patches') // TODO set back to 'Setup'

    const styles = {
        page: {
            backgroundColor: '#8F8F8F',
            height: '100vh'
        }
    }

    return <Flex column align='stretch' style={styles.page}>
        <NavBar {...{ selectedTab, setSelectedTab, perform }}/>
        {selectedTab === 'Setup' && <SetupTab {...{ midiInterfaces, data, setData }}/>}
        {selectedTab === 'Patches' && <PatchesTab {...{ data, setData }}/>}
        {selectedTab === 'Cues' && <div>Cues!</div>}
     </Flex>
}

export default EditPage
