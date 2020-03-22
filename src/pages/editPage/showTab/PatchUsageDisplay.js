import React from 'react'
import _ from 'lodash'

import Colors from '../../../components/colors'
import { ButtonLike } from '../../../components/Components'
import Keyboard from '../../../components/Keyboard'
import { Center, Container, Flex } from '../../../components/Layout'


class PatchUsageDisplay extends React.Component {
    constructor(props) {
        super(props)

        const { data, cue } = props
        const { keyboards } = data.setup

        this.keyboardRefs = {}
        _.forEach(keyboards, k => {
            this.keyboardRefs[k.id] = React.createRef()
        })

        this.patchUsageRefs = []
        for (let i = 0; i < cue.patchUsages.length; ++i) {
            this.patchUsageRefs.push(React.createRef())
        }
    }

    render() {
        const { cue, selectedPatchUsage, setSelectedPatchUsage, data } = this.props
        const { keyboards } = data.setup

        const styles = {
            patchUsage: selected => ({
                display: 'relative',
                alignSelf: 'stretch',
                width: 'unset',
                padding: '0.25rem 0.5rem',
                border: '1px solid black',
                textAlign: 'center',
                backgroundColor: selected ? Colors.blue : 'white',
                color: selected ? 'white' : 'black',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                cursor: 'pointer'
            })
        }
    
        const patchUsagesByKeyboardId = _.groupBy(cue.patchUsages, 'keyboardId')
    
        return <Container alt collapse header='Drag a range of notes to add a patch'>
            {keyboards.map(keyboard => {
                const patchUsages = patchUsagesByKeyboardId[keyboard.id] || []
                return <Center pad key={keyboard.id}>
                    <Flex column>
                        <Keyboard ref={this.keyboardRefs[keyboard.id]} keyboard={keyboard}/>
                        {patchUsages.map((patchUsage, index) => {
                            const { patchId } = patchUsage
                            const patch = _.find(data.patches, { id: patchId })
                            const selected = selectedPatchUsage === patchUsage
                            return <ButtonLike key={index}
                                               ref={this.patchUsageRefs[index]}
                                               style={styles.patchUsage(selected)}
                                               onClick={() => setSelectedPatchUsage(patchUsage)}>
                                {patch.name}
                            </ButtonLike>
                        })}
                    </Flex>
                </Center>
            })}
        </Container>
    }

    componentDidMount() {
        const { cue } = this.props

        for (let i = 0; i < cue.patchUsages.length; ++i) {
            const patchUsage = cue.patchUsages[i]

            const patchUsageDOM = this.patchUsageRefs[i].current
            const keyboardDOM = this.keyboardRefs[patchUsage.keyboardId].current

            const { lowNote, highNote } = patchUsage
            if (lowNote && highNote) {
                const { left } = keyboardDOM.getBounds(lowNote)
                const { right } = keyboardDOM.getBounds(highNote)
                patchUsageDOM.style.marginLeft = `${left}.px`
                patchUsageDOM.style.width = `${right - left + 1}px`
            } else if (lowNote) {
                const { left } = keyboardDOM.getBounds(lowNote)
                patchUsageDOM.style.marginLeft = `${left}px`
            } else if (highNote) {
                const { right } = keyboardDOM.getBounds(highNote)
                patchUsageDOM.style.width = `${right}px`
            }
        }
    }
}

export default PatchUsageDisplay
