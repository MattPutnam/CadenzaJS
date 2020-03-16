import React from 'react'

import PatchesTab from './editPage/PatchesTab'
import SetupTab from './editPage/SetupTab'

import NavBar from '../components/NavBar'



const EditPage = ({ perform, midiInterfaces, data, setData }) => {
    const [selectedTab, setSelectedTab] = React.useState('Patches') // TODO set back to 'Setup'

    const styles = {
        page: {
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#8F8F8F',
            minHeight: '100vh'
        },
        tabs: {
            flex: '1 1 auto'
        }
    }

    return <div style={styles.page}>
        <NavBar {...{ selectedTab, setSelectedTab, perform }}/>
        {selectedTab === 'Setup' && <SetupTab style={styles.tabs} {...{ midiInterfaces, data, setData }}/>}
        {selectedTab === 'Patches' && <PatchesTab style={styles.tabs} {...{ data, setData }}/>}
        {selectedTab === 'Cues' && <div>Cues!</div>}
     </div>
}

export default EditPage
