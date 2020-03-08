import React from 'react'
import NavBar from '../components/NavBar'
import SetupTab from './SetupTab'

const EditPage = ({ perform, midiDevices }) => {
    const [selectedTab, setSelectedTab] = React.useState('Setup')

    return <div>
        <NavBar {...{ selectedTab, setSelectedTab, perform }}/>
        {selectedTab === 'Setup' && <SetupTab {...{ midiDevices }}/>}
        {selectedTab === 'Patches' && <div>Patches!</div>}
        {selectedTab === 'Cues' && <div>Cues!</div>}
     </div>
}

export default EditPage
