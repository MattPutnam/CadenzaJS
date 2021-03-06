import React from 'react'

import Colors from './Colors'
import { Button } from './Components'
import { Flex, Spacer } from './Layout'
import MidiMonitor from './MidiMonitor'


const Tab = ({ title, selectedTab, setSelectedTab, first, last }) => {
    const style = {
        display: 'inline-block',
        padding: '0.5rem 0.75rem',
        cursor: 'pointer',
        backgroundColor: title === selectedTab ? Colors.gray[2] : Colors.gray[3],
        borderRadius: first ? '3px 0 0 3px' : last ? '0 3px 3px 0' : undefined,
        borderRight: last ? undefined : `1px solid ${Colors.gray[2]}`
    }

    return <span style={style} onClick={() => setSelectedTab(title)}>{title}</span>
}

const NavBar = ({ selectedTab, setSelectedTab, perform }) => {
    return (
        <Flex pad align='center'>
            <Tab title='Setup' {...{ selectedTab, setSelectedTab }} first/>
            <Tab title='Patches' {...{ selectedTab, setSelectedTab }}/>
            <Tab title='Show' {...{ selectedTab, setSelectedTab }} last/>
            <Button large onClick={perform}>Perform</Button>
            <Spacer/>
            <MidiMonitor/>
        </Flex>
    )
}

export default NavBar
