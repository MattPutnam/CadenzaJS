import React from 'react'

import { Button, Label, Select, NumberField } from '../../../components/Components'
import { Container, Flex } from '../../../components/Layout'


const Transpose = ({ selectedPatch, setData }) => {
    const { transpose } = selectedPatch

    let amt = transpose || 0
    const down = amt < 0
    if (down) {
        amt = -amt
    }
    const steps = amt % 12
    const octaves = Math.floor(amt / 12)

    const setValue = value => {
        if (value === 0) {
            delete selectedPatch.transpose
        } else {
            selectedPatch.transpose = value
        }
        setData()
    }

    const setOctaves = newOctaves => {
        setValue(selectedPatch.transpose = (newOctaves * 12 + steps) * (down ? -1 : 1))
    }

    const setSteps = newSteps => {
        setValue(selectedPatch.transpose = (octaves * 12 + newSteps) * (down ? -1 : 1))
    }

    const clear = () => {
        setValue(0)
    }

    return <Container alt flex='none' header='Transposition'>
        <Flex pad>
            <Label>Transpose</Label>
            {/* max of 10 just to make the fields the same size */}
            <NumberField value={octaves} max={10} setValue={setOctaves}/>
            <Label>octaves plus</Label>
            <NumberField value={steps} max={11} setValue={setSteps}/>
            <Label>half steps</Label>
            <Select options={['Up', 'Down']} selected={down ? 'Down' : 'Up'} setSelected={() => setValue(-amt)}/>
            <Button onClick={clear}>Clear</Button>
        </Flex>
    </Container>
}

export default Transpose
