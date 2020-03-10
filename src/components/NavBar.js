import React from 'react'
import Button from './Button'
import MIDIMonitor from './MIDIMonitor'

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
    const styles = {
        container: {
            display: 'flex',
            alignItems: 'center',
            padding: '0.5rem'
        },
        spacer: {
            flex: '1 1 auto'
        }
    }

    return <div style={styles.container}>
        <Tab title="Setup" {...{ selectedTab, setSelectedTab }} first/>
        <Tab title="Patches" {...{ selectedTab, setSelectedTab }}/>
        <Tab title="Cues" {...{ selectedTab, setSelectedTab }} last/>
        <Button onClick={perform}>Perform</Button>
        <div style={styles.spacer}></div>
        <MIDIMonitor/>
    </div>
}

export default NavBar
