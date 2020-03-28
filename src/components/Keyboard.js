import React from 'react'
import _ from 'lodash'

import Colors from './colors'
import MidiListener from './MidiListener'

import * as KeyboardUtils from '../utils/KeyboardUtils'
import * as Midi from '../utils/Midi'


const Keyboard = ({
    keyboard, onKeyClick, onRangeDrag, style,
    highlightMidi=true, listenerId,
    highlightOnHover=true, highlightKeys=[], lightHighlightKeys=[],
    ...props
}) => {        
    const [hoverKey, setHoverKey] = React.useState(undefined)
    const [dragStart, setDragStart] = React.useState(undefined)
    const [[pressedNotes], setPressedNotes] = React.useState([new Set()])

    React.useEffect(() => {
        const mouseUpListener = () => setDragStart(undefined)
        document.addEventListener('mouseup', mouseUpListener)
        return () => document.removeEventListener('mouseup', mouseUpListener)
    }, [])

    const handleClick = (k) => {
        onKeyClick(k, keyboard.id)
        setDragStart(undefined)
    }

    const handleRangeDrag = () => {
        if (dragStart && dragStart !== hoverKey) {
            onRangeDrag([dragStart, hoverKey].sort((a, b) => a - b), keyboard.id)
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
            border: '1px solid black',
            backgroundColor: 'white'
        },
        key: (note, first, highlightColor) => {
            const isWhite = KeyboardUtils.isWhite(note)
            let color
            if (highlightColor) {
                color = highlightColor
            } else if (pressedNotes.has(note)) {
                color = Colors.lightBlue
            } else {
                color = isWhite ? 'white' : 'black'
            }

            return {
                display: 'inline-block',
                border: '1px solid black',
                backgroundColor: color,
                width: isWhite ? KeyboardUtils.WHITE_WIDTH : KeyboardUtils.BLACK_WIDTH,
                height: isWhite ? KeyboardUtils.WHITE_HEIGHT : KeyboardUtils.BLACK_HEIGHT,
                marginLeft: first ? 0 : -KeyboardUtils.leftMargin(note),
                zIndex: isWhite ? 0 : 1
            }
        }
    }

    const highlightHover = highlightOnHover && !!(onKeyClick || onRangeDrag)

    const [low, high] = keyboard.range
    return (
        <div style={_.merge(styles.container, style)}
             onMouseLeave={highlightHover ? () => setHoverKey(undefined) : undefined}
             onMouseUp={onRangeDrag ? handleRangeDrag : undefined}
             {...props}>
            {highlightMidi && <MidiListener id={listenerId || `KEYBOARD ${keyboard.id}`}
                                            dispatch={handleMidi}
                                            keyboardId={keyboard.id}/>}
            {_.range(low, high+1).map(k => {
                let highlightColor
                if (k === hoverKey || k === dragStart || highlightKeys.includes(k)) {
                    highlightColor = Colors.blue
                } else if (lightHighlightKeys.includes(k)) {
                    highlightColor = Colors.lightBlue
                }

                return <div key={k}
                            style={styles.key(k, k === low, highlightColor)}
                            onMouseEnter={highlightHover ? () => setHoverKey(k) : undefined}
                            onMouseDown={onRangeDrag ? () => setDragStart(k) : undefined}
                            onClick={onKeyClick ? () => handleClick(k) : undefined}/>
            })}
        </div>
    )
}

export default Keyboard
