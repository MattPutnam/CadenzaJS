import React from 'react'
import _ from 'lodash'

import { NumberField, Placeholder, Select, TextField, Warning } from './Components'
import { Container, Header, HeaderButton, Title } from './Container'
import Icons from './Icons'
import Keyboard from './Keyboard'
import { Center, Flex } from './Layout'
import { List, ListItem } from './List'
import { RadioButtonGroup, RadioButton } from './Radio'
import { Tab, TabList, TabPanel, Tabs } from './Tabs'

import { midiNoteNumberToName } from '../utils/Midi'
import { validateSongOrMeasureNumber } from '../utils/SongAndMeasureNumber'


const ontology = {
    types: ['any of', 'all of', 'all in sequence'],
    inputs: [
        {
            type: 'keyPress',
            label: 'Key Press',
            describe: ({ key }) => `${key ? midiNoteNumberToName(key) : '[unset key]'} pressed`,
            control: props => <KeyPressEditor {...props}/>
        }
    ],
    actions: [
        {
            type: 'cueStep',
            label: 'Cue Step',
            defaultData: () => ({
                stepDirection: 'next'
            }),
            describe: ({ stepDirection }) => stepDirection === 'next' ? 'Next cue' : 'Prev cue',
            control: props => <CueStepEditor {...props}/>
        },
        {
            type: 'goto',
            label: 'Go To Location',
            defaultData: data => {
                const { songs } = data.show
                return {
                    songId: songs[0].id,
                    measure: '1'
                }
            },
            describe: ({ songId, measure }, { show: { songs } }) => {
                const song = _.find(songs, { id: songId })
                return `Go to #${song.number} m. ${measure}`
            },
            control: props => <GotoEditor {...props}/>
        },
        {
            type: 'wait',
            label: 'Wait',
            defaultData: () => ({
                waitTime: 500
            }),
            describe: ({ waitTime }) => `Wait ${waitTime || 0} ms`,
            control: props => <WaitEditor {...props}/>
        },
        {
            type: 'panic',
            label: 'Panic',
            describe: () => 'Panic',
            control: () => <Placeholder>Panic (all notes off)</Placeholder>
        }
    ]
}


const TriggerEditor = ({ object, data, setData }) => {
    const [selectedIndex, setSelectedIndex] = React.useState(undefined)

    const triggers = object.triggers || []
    const trigger = selectedIndex === undefined ? undefined : triggers[selectedIndex]
    const noTriggers = _.isEmpty(triggers)

    const addTrigger = () => {
        const newTrigger = {
            type: ontology.types[0],
            inputs: [],
            actions: []
        }

        if (!object.triggers) {
            object.triggers = []
        }

        object.triggers.push(newTrigger)
        setSelectedIndex(object.triggers.length - 1)
        setData('add trigger')
    }

    const deleteSelf = () => {
        object.triggers.splice(selectedIndex)
        setSelectedIndex(undefined)
        if (_.isEmpty(object.triggers)) {
            delete object.triggers
        }
        setData('delete trigger')
    }

    return (
        <Container alt collapse startCollapsed={noTriggers}>
            <Header>
                <Title>Triggers</Title>
                <HeaderButton icon={Icons.add} onClick={addTrigger}/>
            </Header>
            {noTriggers && <Placeholder>Click '+' to add a trigger</Placeholder>}
            <List selectedItem={selectedIndex} setSelectedItem={setSelectedIndex}>
                {triggers.map((trigger, index) => {
                    return <ListItem key={index} value={index}>{summarize(trigger, data)}</ListItem>
                })}
            </List>
            {trigger && <Editor {...{ trigger, deleteSelf, data, setData }}/>}
        </Container>
    )
}

export default TriggerEditor


const summarize = (trigger, data) => {
    const { inputs, actions, type } = trigger

    const inputString = `[${inputs.map(summarizeInput(data)).join(', ')}]`
    const actionString = `[${actions.map(summarizeAction(data)).join(', ')}]`

    return `On ${type}: ${inputString} do: ${actionString}`
}

const summarizeInput = data => input => {
    const ontologyValue = _.find(ontology.inputs, { type: input.type })
    return ontologyValue.describe(input, data)
}

const summarizeAction = data => action => {
    const ontologyValue = _.find(ontology.actions, { type: action.type })
    return ontologyValue.describe(action, data)
}


const Editor = ({ trigger, deleteSelf, data, setData }) => {
    const styles = {
        container: {
            marginTop: '1rem',
            borderTop: '1px solid black'
        }
    }

    return (
        <div style={styles.container}>
            <Container>
                <Header>
                    <Title>Edit Trigger</Title>
                    <HeaderButton icon={Icons.delete} onClick={deleteSelf}/>
                </Header>
                <TriggerType {...{ trigger, setData }}/>
                <Inputs {...{ trigger, data, setData }}/>
                <Flex pad>Do</Flex>
                <Actions {...{ trigger, data, setData }}/>
            </Container>
        </div>
    )
}

const TriggerType = ({ trigger, setData }) => {
    const { type } = trigger

    const setSelected = newType => {
        trigger.type = newType
        setData('set trigger type')
    }

    return (
        <Flex pad>
            <Select label='On:' options={ontology.types} selected={type} setSelected={setSelected}/>
        </Flex>
    )
}

///////////////////////////////////////////////////////////////////////////////////////////////////
// INPUTS

const Inputs = ({ trigger, data, setData }) => {
    const [selectedIndex, setSelectedIndex] = React.useState(undefined)
    const { inputs } = trigger

    const input = selectedIndex === undefined ? undefined : inputs[selectedIndex]
    const defaultData = ontology.inputs[0].defaultData

    const addInput = () => {
        const newInput = {
            type: ontology.inputs[0].type,
            ...(defaultData ? defaultData(data) : {})
        }

        trigger.inputs.push(newInput)
        setSelectedIndex(trigger.inputs.length - 1)
        setData('add trigger input')
    }

    const deleteSelf = () => {
        trigger.inputs.splice(selectedIndex)
        setSelectedIndex(undefined)
        setData(' delete trigger input')
    }

    const moveUp = () => {
        const elem = inputs[selectedIndex]
        const prev = inputs[selectedIndex-1]
        inputs[selectedIndex-1] = elem
        inputs[selectedIndex] = prev
        setData(`move trigger input up`)
        setSelectedIndex(selectedIndex-1)
    }

    const moveDown = () => {
        const elem = inputs[selectedIndex]
        const next = inputs[selectedIndex+1]
        inputs[selectedIndex+1] = elem
        inputs[selectedIndex] = next
        setData(`move trigger input down`)
        setSelectedIndex(selectedIndex+1)
    }

    return (
        <Container alt>
            <Header>
                <Title>Inputs</Title>
                <HeaderButton icon={Icons.add} onClick={addInput}/>
            </Header>
            <List selectedItem={selectedIndex} setSelectedItem={setSelectedIndex}>
                {inputs.map((input, index) => {
                    return <ListItem key={index} value={index}>{summarizeInput(data)(input)}</ListItem>
                })}
            </List>
            {input && <Input moveUp={selectedIndex > 0 ? moveUp : undefined}
                             moveDown={selectedIndex < inputs.length-1 ? moveDown: undefined}
                             {...{ input, deleteSelf, data, setData }}/>}
        </Container>
    )
}

const Input = ({ input, deleteSelf, moveUp, moveDown, data, setData }) => {
    const { type } = input
    const selectedTab = _.findIndex(ontology.inputs, { type })
    const onTabSelected = index => {
        const { type, defaultData } = ontology.inputs[index]
        input.type = type
        if (defaultData) {
            _.defaults(input, defaultData(data))
        }
        setData('set trigger input type')
    }

    const styles = {
        container: {
            marginTop: '1rem',
            borderTop: '1px solid black'
        }
    }

    return (
        <div style={styles.container}>
            <Container>
                <Header>
                    <Title>Edit Input</Title>
                    {moveUp && <HeaderButton icon={Icons.arrowUp} onClick={moveUp}/>}
                    {moveDown && <HeaderButton icon={Icons.arrowDown} onClick={moveDown}/>}
                    <HeaderButton icon={Icons.delete} onClick={deleteSelf}/>
                </Header>
                <Tabs selectedTab={selectedTab} onTabSelected={onTabSelected}>
                    <TabList>
                        {ontology.inputs.map(({ label }, index) => {
                            return <Tab key={index}>{label}</Tab>
                        })}
                    </TabList>
                    {ontology.inputs.map(({ control }, index) => {
                        return (
                            <TabPanel key={index}>
                                {control({ input, data, setData })}
                            </TabPanel>
                        )
                    })}
                </Tabs>
            </Container>
        </div>
    )
}

const KeyPressEditor = ({ input, data, setData }) => {
    const { key, keyboardId } = input
    const { keyboards } = data.setup

    const onKeyClick = (k, kbdId) => {
        input.key = k
        input.keyboardId = kbdId
        setData('set trigger key')
    }

    return <>
        {keyboards.map(keyboard => {
            return (
                <Center pad key={keyboard.id}>
                    <Keyboard keyboard={keyboard}
                              highlightKeys={keyboardId === keyboard.id ? [key] : []}
                              listenerId={`TriggerInputEditor${keyboard.id}`}
                              onKeyClick={onKeyClick}/>
                </Center>
            )
        })}
    </>
}

///////////////////////////////////////////////////////////////////////////////////////////////////
// ACTIONS

const Actions = ({ trigger, data, setData }) => {
    const [selectedIndex, setSelectedIndex] = React.useState(undefined)
    const { actions } = trigger

    const action = selectedIndex === undefined ? undefined: actions[selectedIndex]
    const defaultData = ontology.actions[0].defaultData

    const addAction = () => {
        const newAction = {
            type: ontology.actions[0].type,
            ...(defaultData ? defaultData(data) : {})
        }

        trigger.actions.push(newAction)
        setSelectedIndex(trigger.actions.length - 1)
        setData('add trigger action')
    }

    const deleteSelf = () => {
        trigger.actions.splice(selectedIndex)
        setData('delete trigger action')
        setSelectedIndex(undefined)
    }

    const moveUp = () => {
        const elem = actions[selectedIndex]
        const prev = actions[selectedIndex-1]
        actions[selectedIndex-1] = elem
        actions[selectedIndex] = prev
        setData(`move trigger input up`)
        setSelectedIndex(selectedIndex-1)
    }

    const moveDown = () => {
        const elem = actions[selectedIndex]
        const next = actions[selectedIndex+1]
        actions[selectedIndex+1] = elem
        actions[selectedIndex] = next
        setData(`move trigger input down`)
        setSelectedIndex(selectedIndex+1)
    }

    return (
        <Container alt>
            <Header>
                <Title>Actions</Title>
                <HeaderButton icon={Icons.add} onClick={addAction}/>
            </Header>
            <List selectedItem={selectedIndex} setSelectedItem={setSelectedIndex}>
                {actions.map((action, index) => {
                    return <ListItem key={index} value={index}>{summarizeAction(data)(action)}</ListItem>
                })}
            </List>
            {action && <Action moveUp={selectedIndex > 0 ? moveUp : undefined}
                               moveDown={selectedIndex < actions.length-1 ? moveDown: undefined}
                               {...{ action, deleteSelf, data, setData }}/>}
        </Container>
    )
}

const Action = ({ action, deleteSelf, moveUp, moveDown, data, setData }) => {
    const { type } = action
    const selectedTab = _.findIndex(ontology.actions, { type })
    const onTabSelected = index => {
        const { type, defaultData } = ontology.actions[index]
        action.type = type
        if (defaultData) {
            _.defaults(action, defaultData(data))
        }
        setData('set trigger action type')
    }

    const styles = {
        container: {
            marginTop: '1rem',
            borderTop: '1px solid black'
        }
    }

    return (
        <div style={styles.container}>
            <Container>
                <Header>
                    <Title>Edit Action</Title>
                    {moveUp && <HeaderButton icon={Icons.arrowUp} onClick={moveUp}/>}
                    {moveDown && <HeaderButton icon={Icons.arrowDown} onClick={moveDown}/>}
                    <HeaderButton icon={Icons.delete} onClick={deleteSelf}/>
                </Header>
                <Tabs selectedTab={selectedTab} onTabSelected={onTabSelected}>
                    <TabList>
                        {ontology.actions.map(({ label }, index) => {
                            return <Tab key={index}>{label}</Tab>
                        })}
                    </TabList>
                    {ontology.actions.map(({ control }, index) => {
                        return (
                            <TabPanel key={index}>
                                {control({ action, data, setData })}
                            </TabPanel>
                        )
                    })}
                </Tabs>
            </Container>
        </div>
    )
}

const CueStepEditor = ({ action, setData }) => {
    const selected = action.stepDirection === 'next' ? 0 : 1
    const onSelected = index => {
        if (index === 0) {
            action.stepDirection = 'next'
        } else if (index === 1) {
            action.stepDirection = 'prev'
        }
        setData('set step direction')
    }

    return (
        <RadioButtonGroup {...{ selected, onSelected }}>
            <RadioButton>Advance to the next cue</RadioButton>
            <RadioButton>Go back to the previous cue</RadioButton>
        </RadioButtonGroup>
    )
}

const GotoEditor = ({ action, data, setData }) => {
    const { songs } = data.show

    const [error, setError] = React.useState(undefined)

    const setSongId = newId => {
        action.songId = newId
        setData('set go to location', 'TRIGGER_GOTO')
    }

    const setMeasure = newMeasure => {
        const trimmed = newMeasure.trim()
        const err = validateSongOrMeasureNumber(trimmed)
        if (err) {
            setError(err)
        } else {
            action.measure = trimmed
            setData('set go to location', 'TRIGGER_GOTO')
            setError(undefined)
        }
    }

    return (
        <Flex pad>
            <Select label='Song:'
                    options={songs}
                    render={song => `${song.number}. ${song.name}`}
                    valueRender={song => song.id}
                    selected={action.songId}
                    setSelected={id => setSongId(parseInt(id, 10))}/>
            <TextField label='Measure:'
                       size={6}
                       value={action.measure || ''}
                       setValue={setMeasure}/>
            {error && <Warning>{error}</Warning>}
        </Flex>
    )
}

const WaitEditor = ({ action, setData }) => {
    const setValue = newValue => {
        action.waitTime = parseInt(newValue)
        setData('set wait duration', 'WAITDURATION')
    }

    return (
        <Flex pad>
            <NumberField label='Wait' max={10000} value={action.waitTime || 0} setValue={setValue}/>
            milliseconds
        </Flex>
    )
}
