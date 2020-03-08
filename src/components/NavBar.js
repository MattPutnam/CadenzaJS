import React from 'react';
import Button from './Button';
import MIDIMonitor from './MIDIMonitor';

const Tab = ({ title, selectedTab, setSelectedTab }) => {
    let style = {
        margin: '0 0.5rem',
        cursor: 'pointer',
        fontWeight: title === selectedTab ? 'bold' : undefined
    }

    return <span style={style} onClick={() => setSelectedTab(title)}>
        {title}
    </span>;
}

const NavBar = ({ selectedTab, setSelectedTab }) => {
    let styles = {
        container: {
            display: 'flex'
        },
        midiMonitor: {
            flex: '1 1 auto',
            textAlign: 'center'
        }
    }

    return <div style={styles.container}>
        <Tab title="Setup" selectedTab={selectedTab} setSelectedTab={setSelectedTab}/>
        <Tab title="Patches" selectedTab={selectedTab} setSelectedTab={setSelectedTab}/>
        <Tab title="Cues" selectedTab={selectedTab} setSelectedTab={setSelectedTab}/>
        <div style={styles.midiMonitor}>
            <MIDIMonitor/>
        </div>
        <Button>Perform</Button>
    </div>;
}

export default NavBar;
