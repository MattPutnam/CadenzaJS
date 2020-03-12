import _ from 'lodash'


export const NOTE_ON = "NOTE_ON"
export const NOTE_OFF = "NOTE_OFF"
export const CONTROL = "CONTROL"
export const PITCH_BEND = "PITCH_BEND"
export const UNKNOWN = "UNKNOWN"


const parseHelper = (command, byte1, byte2) => {
    if (command === 9) {
        if (byte2 === 0) {
            return {
                type: NOTE_OFF,
                note: byte1
            }
        } else {
            return {
                type: NOTE_ON,
                note: byte1,
                velocity: byte2
            }
        }
    } else if (command === 8) {
        return {
            type: NOTE_OFF,
            note: byte1
        }
    } else if (command === 11) {
        return {
            type: CONTROL,
            controller: byte1,
            value: byte2
        }
    } else if (command === 14 ) {
        return {
            type: PITCH_BEND,
            value: byte2
        }
    } else {
        return {
            type: UNKNOWN,
            byte1,
            byte2
        }
    }
}

export const parseMidiMessage = (rawMsg) => {
    if (!rawMsg) {
        return {}
    }

    const [ commandChannel, byte1, byte2 ] = rawMsg.data
    const command = commandChannel >> 4
    const channel = commandChannel & 0xf

    const parsed = parseHelper(command, byte1, byte2)
    parsed.channel = channel
    parsed.device = MIDIDeviceToName(rawMsg.target)

    return parsed
}


const noteList = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

const midiNoteNumberToName = (midiNumber) => {
    const octave = Math.floor(midiNumber / 12) - 1
    const noteIndex = midiNumber % 12
    return noteList[noteIndex] + octave
}

export const toString = (midi) => {
    const { channel, note, velocity, controller, value } = midi

    switch (midi.type) {
        case NOTE_ON:
            return `${channel} ${midiNoteNumberToName(note)} ${velocity}`
        case NOTE_OFF:
            return `${channel} ${midiNoteNumberToName(note)} OFF`
        case CONTROL:
            return `${channel} CC${controller} ${value}`
        case PITCH_BEND:
            return `${channel} PB ${value}`
        default: return '?'
    }
}


let focusStack = []

export const pushMidiReceiver = (midiReceiver, id) => focusStack.push({ midiReceiver, id })

export const removeMidiReceiver = (id) => _.remove(focusStack, { id })

export const popThroughMidiReceiver = (id) => {
    const index = _.findIndex(focusStack, { id })
    focusStack = _.take(focusStack, index-1)
}

export const notify = (parsedMessage) => {
    const [ top ] = focusStack.slice(-1)
    top.midiReceiver(parsedMessage)
}


export const MIDIDeviceToName = device => `${device.manufacturer} ${device.name}`
