import React from 'react'
import _ from 'lodash'

import Colors from './colors'
import MidiListener from './MidiListener'

import * as Midi from '../utils/Midi'


const WHITE_HEIGHT = 81 // height of white key
const WHITE_WIDTH = 14  // width of white key
const BLACK_HEIGHT = 50 // height of black key
const BLACK_WIDTH = 11  // width of black key

const CUT_HALF = WHITE_WIDTH / 2 // cut-in of C# into C, half the width of a white key
const CUT_NEGHALF = BLACK_WIDTH - CUT_HALF // cut-in of C# into D, the remaining part of the black key
const CUT_MIDHALF = BLACK_WIDTH / 2 // cut-in of G# into G or A, half the width of a black key

const LEFT_MARGINS = [
    0,
        CUT_HALF,
    CUT_NEGHALF,
        CUT_NEGHALF,
    CUT_HALF,
    0,
        CUT_HALF,
    CUT_NEGHALF,
        CUT_MIDHALF,
    CUT_MIDHALF,
        CUT_NEGHALF,
    CUT_HALF
]


class Keyboard extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            hoverKey: undefined,
            dragStart: undefined,
            pressedNotes: new Set()
        }

        this.mouseUpListener = () => this.setState({ dragStart: undefined })

        this.keyRefs = {}
        const [low, high] = props.keyboard.range
        _.range(low, high+1).forEach(n => this.keyRefs[n] = React.createRef())
    }

    render() {
        const { keyboard, onKeyClick, onRangeDrag, style, ...props } = this.props
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
                const noteMod = note % 12
                const isWhite = [0, 2, 4, 5, 7, 9, 11].includes(noteMod)
                return {
                    display: 'inline-block',
                    border: '1px solid black',
                    backgroundColor: pressedNotes.has(note) ? Colors.lightBlue : highlight ? Colors.blue : isWhite ? 'white' : 'black',
                    width: isWhite ? WHITE_WIDTH : BLACK_WIDTH,
                    height: isWhite ? WHITE_HEIGHT : BLACK_HEIGHT,
                    marginLeft: first ? 0 : -LEFT_MARGINS[noteMod],
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
            <MidiListener id={`KEYBOARD ${keyboard.id}`} dispatch={msg => this.handleMidi(msg)} keyboardId={keyboard.id}/>
            {_.range(low, high+1).map(k => {
                const shouldHighlight = k === hoverKey || k === dragStart
                return <div key={k}
                            ref={this.keyRefs[k]}
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

    getBounds(key) {
        const ref = this.keyRefs[key]
        if (!ref) {
            console.error(`Key ${key} is out of range for this keyboard`)
        }

        const left = ref.current.offsetLeft - ref.current.parentElement.offsetLeft
        const right = left + ref.current.offsetWidth
        return { left, right }
    }
}

export default Keyboard
