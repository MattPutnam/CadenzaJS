import React from 'react'
import NavBar from '../components/NavBar'
import SetupTab from './SetupTab'

const EditPage = ({ perform, midiDevices, showData }) => {
    const [selectedTab, setSelectedTab] = React.useState('Setup')

    const style = {
        backgroundColor: '#8F8F8F',
        height: '100vh'
    }

    return <div style={style}>
        <NavBar {...{ selectedTab, setSelectedTab, perform }}/>
        {selectedTab === 'Setup' && <SetupTab {...{ midiDevices, showData }}/>}
        {selectedTab === 'Patches' && <div>Patches!</div>}
        {selectedTab === 'Cues' && <div>Cues!</div>}
     </div>
}

export default EditPage
