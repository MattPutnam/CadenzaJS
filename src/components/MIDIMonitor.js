import React from 'react';
import * as MIDI from '../midi/MIDI'

const MIDIMonitor = (lastEvent) => {
    return <>
        <span>MIDI in:</span>
        <span>{MIDI.toString(MIDI.fromRaw(lastEvent))}</span>
    </>;
}

export default MIDIMonitor;
