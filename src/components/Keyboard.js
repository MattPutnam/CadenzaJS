import React from 'react'
import _ from 'lodash'
import Colors from './colors'


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
            dragStart: undefined
        }

        this.mouseUpListener = () => this.setState({ dragStart: undefined })

        this.refs = {}
        const [low, high] = props.keyboard.range
        _.range(low, high+1).forEach(n => this.refs[n] = React.createRef())
    }

    render() {
        const { keyboard, onKeyClick, onRangeDrag, highlight } = this.props
        const { hoverKey, dragStart } = this.state
        const setHoverKey = hk => this.setState({ hoverKey: hk })
        const setDragStart = ds => this.setState({ dragStart: ds })

        const styles = {
            container: {
                display: 'inline-flex',
                alignItems: 'flex-start',
                border: '1px solid black',
            },
            key: (keymod, first, highlight) => {
                const isWhite = [0, 2, 4, 5, 7, 9, 11].includes(keymod)
                return {
                    display: 'inline-block',
                    border: '1px solid black',
                    backgroundColor: highlight ? Colors.blue : isWhite ? 'white' : 'black',
                    width: isWhite ? WHITE_WIDTH : BLACK_WIDTH,
                    height: isWhite ? WHITE_HEIGHT : BLACK_HEIGHT,
                    marginLeft: first ? 0 : -LEFT_MARGINS[keymod],
                    zIndex: isWhite ? 0 : 1
                }
            }
        }
    
        const handleClick = (k, e) => {
            onKeyClick(k)
            setDragStart(undefined)
        }

        const handleRangeDrag = () => {
            if (dragStart && dragStart !== hoverKey) {
                onRangeDrag([dragStart, hoverKey].sort())
                
                setDragStart(undefined)
            }
        }
    
        const highlightHover = !!(onKeyClick || onRangeDrag)
    
        const [low, high] = keyboard.range
        return <div style={styles.container}
                    onMouseLeave={highlightHover ? () => setHoverKey(undefined) : undefined}
                    onMouseUp={onRangeDrag ? handleRangeDrag : undefined}>
            {_.range(low, high+1).map(k => {
                const shouldHighlight = (highlight && highlight.has(k)) || k === hoverKey || k === dragStart
                return <div key={k}
                            ref={this.refs[k]}
                            style={styles.key(k % 12, k === low, shouldHighlight)}
                            onMouseEnter={highlightHover ? () => setHoverKey(k) : undefined}
                            onMouseDown={onRangeDrag ? () => setDragStart(k) : undefined}
                            onClick={onKeyClick ? (e) => handleClick(k, e) : undefined}/>
            })}
        </div>
    }

    componentDidMount() {
        document.addEventListener('mouseup', this.mouseUpListener)
    }

    componentWillUnmount() {
        document.removeEventListener('mouseup', this.mouseUpListener)
    }

    getBounds(key) {
        const ref = this.refs[key]
        if (!ref) {
            console.error(`Key ${key} is out of range for this keyboard`)
        }

        const left = ref.offsetLeft - ref.parentElement.offsetLeft
        const right = left + ref.offsetWidth
        return { left, right }
    }
}

export default Keyboard
