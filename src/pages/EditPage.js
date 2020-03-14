import React from 'react'

import SetupTab from './editPage/SetupTab'

import NavBar from '../components/NavBar'


const EditPage = ({ perform, midiInterfaces, data, setData }) => {
    const [selectedTab, setSelectedTab] = React.useState('Setup')

    const style = {
        backgroundColor: '#8F8F8F',
        height: '100vh'
    }

    return <div style={style}>
        <NavBar {...{ selectedTab, setSelectedTab, perform }}/>
        {selectedTab === 'Setup' && <SetupTab {...{ midiInterfaces, data, setData }}/>}
        {selectedTab === 'Patches' && <div>Patches!</div>}
        {selectedTab === 'Cues' && <div>Cues!</div>}
     </div>
}

export default EditPage
