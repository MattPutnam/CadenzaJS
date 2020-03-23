import React from 'react'
import _ from 'lodash'

import Colors from './colors'
import MidiListener from './MidiListener'

import * as KeyboardUtils from '../utils/KeyboardUtils'
import * as Midi from '../utils/Midi'


const Keyboard = ({ keyboard, onKeyClick, onRangeDrag, style, highlight=true, listenerId, ...props }) => {
    const [hoverKey, setHoverKey] = React.useState(undefined)
    const [dragStart, setDragStart] = React.useState(undefined)
    const [[pressedNotes], setPressedNotes] = React.useState([new Set()])

    React.useEffect(() => {
        const mouseUpListener = () => setDragStart(undefined)
        document.addEventListener('mouseup', mouseUpListener)
        return () => document.removeEventListener('mouseup', mouseUpListener)
    }, [])

    const handleClick = (k) => {
        onKeyClick(k)
        setDragStart(undefined)
    }

    const handleRangeDrag = () => {
        if (dragStart && dragStart !== hoverKey) {
            onRangeDrag([dragStart, hoverKey].sort((a, b) => a - b))
            setDragStart(undefined)
        }
    }

    const handleMidi = parsedMessage => {
        const { type, note } = parsedMessage
        
        if (type === Midi.NOTE_ON) {
            pressedNotes.add(note)
        } else if (type === Midi.NOTE_OFF) {
            pressedNotes.delete(note)
        }
        setPressedNotes([pressedNotes])
    }

    const styles = {
        container: {
            display: 'inline-flex',
            alignItems: 'flex-start',
            border: '1px solid black'
        },
        key: (note, first, highlight) => {
            const isWhite = KeyboardUtils.isWhite(note)
            return {
                display: 'inline-block',
                border: '1px solid black',
                backgroundColor: pressedNotes.has(note) ? Colors.lightBlue : highlight ? Colors.blue : isWhite ? 'white' : 'black',
                width: isWhite ? KeyboardUtils.WHITE_WIDTH : KeyboardUtils.BLACK_WIDTH,
                height: isWhite ? KeyboardUtils.WHITE_HEIGHT : KeyboardUtils.BLACK_HEIGHT,
                marginLeft: first ? 0 : -KeyboardUtils.leftMargin(note),
                zIndex: isWhite ? 0 : 1
            }
        }
    }

    const highlightHover = !!(onKeyClick || onRangeDrag)

    const [low, high] = keyboard.range
    return <div style={_.merge(styles.container, style)}
                onMouseLeave={highlightHover ? () => setHoverKey(undefined) : undefined}
                onMouseUp={onRangeDrag ? handleRangeDrag : undefined}
                {...props}>
        {highlight && <MidiListener id={listenerId || `KEYBOARD ${keyboard.id}`}
                                    dispatch={handleMidi}
                                    keyboardId={keyboard.id}/>}
        {_.range(low, high+1).map(k => {
            const shouldHighlight = k === hoverKey || k === dragStart
            return <div key={k}
                        style={styles.key(k, k === low, shouldHighlight)}
                        onMouseEnter={highlightHover ? () => setHoverKey(k) : undefined}
                        onMouseDown={onRangeDrag ? () => setDragStart(k) : undefined}
                        onClick={onKeyClick ? () => handleClick(k) : undefined}/>
        })}
    </div>
}

export default Keyboard
