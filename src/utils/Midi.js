import _ from 'lodash'


export const NOTE_OFF = 8
export const NOTE_ON = 9
export const KEY_AFTERTOUCH = 10
export const CONTROL = 11
export const PROGRAM_CHANGE = 12
export const CHANNEL_AFTERTOUCH = 13
export const PITCH_BEND = 14
export const UNKNOWN = 'UNKNOWN'


const parseHelper = (command, byte1, byte2) => {
    if (command === 9) {
        if (byte2 === 0) {
            return {
                type: NOTE_OFF,
                note: byte1,
                velocity: 0
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
            note: byte1,
            velocity: byte2
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

const midiInterfaceIdToChannelToKeyboardId = {}
const midiInterfaceIdToName = {}

export const parseMidiMessage = (rawMsg, keyboardData) => {
    if (!rawMsg) {
        return {}
    }

    const midiInterface = rawMsg.target

    const [status, byte1, byte2] = rawMsg.data
    const command = status >> 4
    const channel = status & 0xf

    const parsed = parseHelper(command, byte1, byte2)
    parsed.channel = channel

    let midiInterfaceName = midiInterfaceIdToName[midiInterface.id]
    if (!midiInterfaceName) {
        midiInterfaceName = midiInterfaceToName(midiInterface)
        midiInterfaceIdToName[midiInterface.id] = midiInterfaceName
    }
    parsed.midiInterfaceName = midiInterfaceName

    let keyboardId
    let channelToKeyboardId = midiInterfaceIdToChannelToKeyboardId[midiInterface.id]
    if (!channelToKeyboardId) {
        const keyboard = _.find(keyboardData, { midiInterfaceName: midiInterfaceToName(midiInterface), channel })
        if (!keyboard) {
            return parsed
        }
        keyboardId = keyboard.id
        channelToKeyboardId = { channel: keyboardId }
        midiInterfaceIdToChannelToKeyboardId[midiInterface.id] = channelToKeyboardId
    } else {
        keyboardId = channelToKeyboardId[channel]
        if (!keyboardId) {
            const keyboard = _.find(keyboardData, { midiInterfaceName: midiInterfaceToName(midiInterface), channel })
            if (!keyboard) {
                return parsed
            }
            keyboardId = keyboard.id
            channelToKeyboardId[channel] = keyboardId
        }
    }
    parsed.keyboardId = keyboardId

    return parsed
}

export const unparse = parsedMessage => {
    const { channel, type, note, velocity, controller, value } = parsedMessage
    const status = (type << 4) | channel

    switch (type) {
        case NOTE_ON: // fallthrough
        case NOTE_OFF: return [status, note, velocity]
        case CONTROL: return [status, controller, value]
        case PROGRAM_CHANGE: return [status, value]
        case PITCH_BEND: return [status, 0, value]
        default: return []
    }
}

export const setVolumeMessage = (channel, volume) => {
    return unparse({
        type: CONTROL,
        controller: 7,
        value: volume,
        channel
    })
}

export const programChangeMessage = (channel, program) => {
    return unparse({
        type: PROGRAM_CHANGE,
        channel,
        value: program
    })
}


const noteList = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B']

export const midiNoteNumberToName = (midiNumber) => {
    const octave = Math.floor(midiNumber / 12) - 1
    const noteIndex = midiNumber % 12
    return noteList[noteIndex] + octave
}


export const ccNames = {
    0: { short: 'BANK', long: 'Bank Select' },
    1: { short: 'MOD', long: 'Modulation Wheel' },
    2: { short: 'BRCTL', long: 'Breath Controller' },
    4: { short: 'FC', long: 'Foot Controller' },
    5: { short: 'PRTTM', long: 'Portamento Time' },
    6: { short: 'DEMSB', long: 'Data Entry MSB' },
    7: { short: 'VOL', long: 'Main Volume' },
    8: { short: 'BAL', long: 'Balance' },
    10: { short: 'PAN', long: 'Pan' },
    11: { short: 'EXPR', long: 'Expression' },
    12: { short: 'EC1', long: 'Effect Control 1' },
    13: { short: 'EC2', long: 'Effect Control 2' },
    16: { short: 'GPC1', long: 'General Purpose Controller 1' },
    17: { short: 'GPC2', long: 'General Purpose Controller 2' },
    18: { short: 'GPC3', long: 'General Purpose Controller 3' },
    19: { short: 'GPC4', long: 'General Purpose Controller 4' },
    64: { short: 'SUST', long: 'Damper Pedal (Sustain)' },
    65: { short: 'PORT', long: 'Portamento' },
    66: { short: 'SOST', long: 'Sostenuto' },
    67: { short: 'SOFT', long: 'Soft Pedal' },
    68: { short: 'LEGFS', long: 'Legato Footswitch' },
    69: { short: 'HOLD2', long: 'Hold 2' },
    70: { short: 'SC1', long: 'Sound Controller 1 (default: Sound Variation)' },
    71: { short: 'SC2', long: 'Sound Controller 2 (default: Timbre/Harmonic Content)' },
    72: { short: 'SC3', long: 'Sound Controller 3 (default: Release Time)' },
    73: { short: 'SC4', long: 'Sound Controller 4 (default: Attack Time)' },
    74: { short: 'SC5', long: 'Sound Controller 5 (default: Brightness)' },
    75: { short: 'SC6', long: 'Sound Controller 6' },
    76: { short: 'SC7', long: 'Sound Controller 7' },
    77: { short: 'SC8', long: 'Sound Controller 8' },
    78: { short: 'SC9', long: 'Sound Controller 9' },
    79: { short: 'SC10', long: 'Sound Controller 10' },
    80: { short: 'GPC5', long: 'General Purpose Controller 5' },
    81: { short: 'GPC6', long: 'General Purpose Controller 6' },
    82: { short: 'GPC7', long: 'General Purpose Controller 7' },
    83: { short: 'GPC8', long: 'General Purpose Controller 8' },
    84: { short: 'PTCTL', long: 'Portamento Control' },
    91: { short: 'FX1D', long: 'Effects 1 Depth (previously External Effects Depth)' },
    92: { short: 'FX2D', long: 'Effects 2 Depth (previously Tremolo Depth)' },
    93: { short: 'FX3D', long: 'Effects 3 Depth (previously Chorus Depth)' },
    94: { short: 'FX4D', long: 'Effects 4 Depth (previously Detune Depth)' },
    95: { short: 'FX5D', long: 'Effects 5 Depth (previously Phaser Depth)' },
    96: { short: 'INC', long: 'Data Increment' },
    97: { short: 'DEC', long: 'Data Decrement' },
    98: { short: 'NPLSB', long: 'Non-Registered Parameter Number LSB' },
    99: { short: 'NPMSB', long: 'Non-Registered Parameter Number MSB' },
    100: { short: 'RPLSB', long: 'Registered Parameter Number LSB' },
    101: { short: 'RPMSB', long: 'Registered Parameter Number MSB' },
    121: { short: 'RESET', long: 'Reset All Controllers' },
    122: { short: 'LOCAL', long: 'Local Control' },
    123: { short: 'PANIC', long: 'All Notes Off' },
    124: { short: 'OMOFF', long: 'Omni Off' },
    125: { short: 'OMON', long: 'Omni On' },
    126: { short: 'MONO', long: 'Mono On (Poly Off)' },
    127: { short: 'POLY', long: 'Poly On (Mono Off)' }
}

export const shortCCName = cc => {
    const n = ccNames[cc]
    return n ? n.short : `CC${cc}`
}

export const longCCName = cc => {
    const n = ccNames[cc]
    return n ? n.long : `Controller ${cc}`
}

export const toString = (parsedMessage) => {
    const { type, channel, note, velocity, controller, value } = parsedMessage

    let fields

    switch (type) {
        case NOTE_ON:
            fields = [midiNoteNumberToName(note), velocity]
            break
        case NOTE_OFF:
            fields = [midiNoteNumberToName(note), 'OFF']
            break
        case CONTROL:
            fields = [shortCCName(controller), value]
            break
        case PITCH_BEND:
            fields = ['BEND', value]
            break
        default:
    }

    if (fields) {
        const ch = `CH${channel+1}`.padEnd(4)
        const [f2, f3] = fields
        return `${ch} ${f2.toString().padStart(3).padEnd(5)} ${f3.toString().padEnd(3)}`
    } else {
        return '?'
    }
}


let listeners = []

export const addMidiListener = (midiListener, id, filter) => listeners.push({ midiListener, id, filter })

export const removeMidiListener = (id) => _.remove(listeners, { id })

export const notifyMidiListeners = (parsedMessage) => {
    listeners.forEach(({ midiListener, filter }) => {
        if (!filter || filter(parsedMessage)) {
            midiListener(parsedMessage)
        }
    })
}


export const midiInterfaceToName = midiInterface => `${midiInterface.manufacturer} ${midiInterface.name}`

export const findInterfaceByName = (interfaces, name) => _.find(interfaces, i => midiInterfaceToName(i) === name)
