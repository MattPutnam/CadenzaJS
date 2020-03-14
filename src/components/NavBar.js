import React from 'react'

import Button from './Button'
import { Flex, Spacer } from './Flex'
import MidiMonitor from './MidiMonitor'


const Tab = ({ title, selectedTab, setSelectedTab, first, last }) => {
    const style = {
        display: 'inline-block',
        padding: '0.5rem 0.75rem',
        cursor: 'pointer',
        color: 'white',
        backgroundColor: title === selectedTab ? '#585858' : '#808080',
        borderRadius: first ? '3px 0 0 3px' : last ? '0 3px 3px 0' : undefined,
        borderRight: last ? undefined : '1px solid #666666'
    }

    return <span style={style} onClick={() => setSelectedTab(title)}>
        {title}
    </span>
}

const NavBar = ({ selectedTab, setSelectedTab, perform }) => {
    const style = {
        padding: '0.5rem'
    }

    return <Flex align='center' style={style}>
        <Tab title='Setup' {...{ selectedTab, setSelectedTab }} first/>
        <Tab title='Patches' {...{ selectedTab, setSelectedTab }}/>
        <Tab title='Cues' {...{ selectedTab, setSelectedTab }} last/>
        <Button onClick={perform}>Perform</Button>
        <Spacer/>
        <MidiMonitor/>
    </Flex>
}

export default NavBar
