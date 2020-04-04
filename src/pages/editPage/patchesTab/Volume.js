import React from 'react'

import { NumberField } from '../../../components/Components'
import { Container, Header, Title } from '../../../components/Container'
import { Flex } from '../../../components/Layout'


const Volume = ({ selectedPatch, setData }) => {
    const setVolume = newVolume => {
        selectedPatch.volume = newVolume
        setData('change patch volume', `patchVolume${selectedPatch.id}`)
    }

    const styles = {
        container: {
            marginLeft: 0
        },
        column: {
            height: '100%'
        },
        field: {
            margin: 0
        },
        slider: {
            WebkitAppearance: 'slider-vertical',
            margin: '1rem auto',
            width: '1rem',
            height: '100%'
        }
    }

    return (
        <Container alt flex='none' style={styles.container}>
            <Header>
                <Title>Volume</Title>
            </Header>
            <Flex column pad align='center' style={styles.column}>
                <NumberField value={selectedPatch.volume} max={127} setValue={setVolume} style={styles.field}/>
                <input type='range'
                       min={1} max={127}
                       value={selectedPatch.volume}
                       style={styles.slider}
                       onChange={e => setVolume(parseInt(e.target.value, 10))}/>
            </Flex>
        </Container>
    )
}

export default Volume
