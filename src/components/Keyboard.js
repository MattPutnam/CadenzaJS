import React from 'react'
import _ from 'lodash'

import Colors from './colors'
import MidiListener from './MidiListener'

import * as KeyboardUtils from '../utils/KeyboardUtils'
import * as Midi from '../utils/Midi'


class Keyboard extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            hoverKey: undefined,
            dragStart: undefined,
            pressedNotes: new Set()
        }

        this.mouseUpListener = () => this.setState({ dragStart: undefined })
    }

    render() {
        const { keyboard, onKeyClick, onRangeDrag, style, highlight=true, listenerId, ...props } = this.props
        const { hoverKey, dragStart, pressedNotes } = this.state
        const setHoverKey = hk => this.setState({ hoverKey: hk })
        const setDragStart = ds => this.setState({ dragStart: ds })

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
    
        const highlightHover = !!(onKeyClick || onRangeDrag)
    
        const [low, high] = keyboard.range
        return <div style={_.merge(styles.container, style)}
                    onMouseLeave={highlightHover ? () => setHoverKey(undefined) : undefined}
                    onMouseUp={onRangeDrag ? handleRangeDrag : undefined}
                    {...props}>
            {highlight && <MidiListener id={listenerId || `KEYBOARD ${keyboard.id}`}
                                        dispatch={msg => this.handleMidi(msg)}
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

    componentDidMount() {
        document.addEventListener('mouseup', this.mouseUpListener)
    }

    componentWillUnmount() {
        document.removeEventListener('mouseup', this.mouseUpListener)
    }

    handleMidi(parsedMessage) {
        const { type, note } = parsedMessage
        const { pressedNotes } = this.state
        if (type === Midi.NOTE_ON) {
            pressedNotes.add(note)
        } else if (type === Midi.NOTE_OFF) {
            pressedNotes.delete(note)
        }
        this.setState({ pressedNotes })
    }
}

export default Keyboard
