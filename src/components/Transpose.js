import React from 'react'

import { Button, Select, NumberField } from './Components'
import { Container, Flex } from './Layout'


const Transpose = ({ object, setData, alt }) => {
    const { transpose } = object

    let amt = transpose || 0
    const down = amt < 0
    if (down) {
        amt = -amt
    }
    const steps = amt % 12
    const octaves = Math.floor(amt / 12)

    const setValue = value => {
        if (value === 0) {
            delete object.transpose
        } else {
            object.transpose = value
        }
        setData()
    }

    const setOctaves = newOctaves => {
        setValue((newOctaves * 12 + steps) * (down ? -1 : 1))
    }

    const setSteps = newSteps => {
        setValue((octaves * 12 + newSteps) * (down ? -1 : 1))
    }

    const clear = () => {
        setValue(0)
    }

    return (
        <Container alt={alt} flex='none' header='Transposition'>
            <Flex pad>
                {/* max of 10 just to make the fields the same size */}
                <NumberField label='Transpose' value={octaves} max={10} setValue={setOctaves}/>
                <NumberField label='octaves plus' value={steps} max={11} setValue={setSteps}/>
                <Select label='half steps' options={['Up', 'Down']} selected={down ? 'Down' : 'Up'} setSelected={() => setValue(-amt)}/>
                <Button onClick={clear}>Clear</Button>
            </Flex>
        </Container>
    )
}

export default Transpose
