export const NOTE_ON = "NOTE_ON"
export const NOTE_OFF = "NOTE_OFF"

export const fromRaw = (rawMsg) => {
    // TODO
    return {
        type: NOTE_ON,
        channel: 0,
        number: 60,
        velocity: 100
    }
}

export const toString = (midi) => {
    switch (midi.type) {
        case NOTE_ON:
            return `${midi.channel} ${midiNoteNumberToName(midi.number)} ${midi.velocity}`
        case NOTE_OFF:
            return `${midi.channel} ${midiNoteNumberToName(midi.number)} OFF`
        default: return '?'
    }
}

const noteList = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

const midiNoteNumberToName = (midiNumber) => {
    const octave = Math.floor(midiNumber / 12) - 1
    const noteIndex = midiNumber % 12
    return noteList[noteIndex] + octave
}
