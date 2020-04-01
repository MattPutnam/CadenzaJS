import React from 'react'
import _ from 'lodash'

import { Placeholder, Select } from './Components'
import Icons from './Icons'
import { Center, Container, Flex } from './Layout'
import { List, ListItem } from './List'
import { Tab, TabList, TabPanel, Tabs } from './Tabs'

import { midiNoteNumberToName } from '../utils/Midi'
import Keyboard from './Keyboard'


const ontology = {
    types: ['any of', 'all of', 'all in sequence'],
    inputs: {
        types: ['keyPress']
    },
    actions: {
        types: ['cueAdvance', 'cueReverse']
    }
}


const TriggerEditor = ({ object, data, setData }) => {
    const [selectedIndex, setSelectedIndex] = React.useState(undefined)

    const { triggers } = object
    const trigger = selectedIndex === undefined ? undefined : triggers[selectedIndex]
    const noTriggers = _.isEmpty(triggers)

    const addTrigger = () => {
        const newTrigger = {
            type: ontology.types[0],
            inputs: [],
            actions: [{ type: ontology.actions.types[0] }]
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
        setData('delete trigger')
    }

    const buttons = [{ icon: Icons.add, onClick: addTrigger }]

    return <Container alt collapse startCollapsed={noTriggers} header='Triggers' buttons={buttons}>
        {noTriggers && <Placeholder>Click '+' to add a trigger</Placeholder>}
        <List selectedItem={selectedIndex} setSelectedItem={setSelectedIndex}>
            {triggers.map((trigger, index) => {
                return <ListItem key={index} value={index}>{summarize(trigger)}</ListItem>
            })}
        </List>
        {trigger && <Editor {...{ trigger, deleteSelf, data, setData }}/>}
    </Container>
}

export default TriggerEditor


const summarize = trigger => {
    const { inputs, actions, type } = trigger

    const inputString = `[${inputs.map(summarizeInput).join(', ')}]`
    const actionString = `[${actions.map(summarizeAction).join(', ')}]`

    return `On ${type}: ${inputString} do: ${actionString}`
}

const summarizeInput = input => {
    const { type, key } = input

    switch(type) {
        case 'keyPress': return `${key ? midiNoteNumberToName(key) : '[unset key]'} pressed`
        default: throw new Error(`Unknown trigger input type: ${type}`)
    }
}

const summarizeAction = action => {
    const { type } = action

    switch(type) {
        case 'cueAdvance': return 'Advance'
        case 'cueReverse': return 'Reverse'
        default: throw new Error(`Unknown trigger action type: ${type}`)
    }
}


const Editor = ({ trigger, deleteSelf, data, setData }) => {
    const styles = {
        container: {
            marginTop: '1rem',
            borderTop: '1px solid black'
        }
    }

    const buttons = [{ icon: Icons.delete, onClick: deleteSelf }]

    return (
        <div style={styles.container}>
            <Container header='Edit Trigger' buttons={buttons}>
                <TriggerType {...{ trigger, setData }}/>
                <Inputs {...{ trigger, data, setData }}/>
                <Flex pad>Do</Flex>
                <Actions {...{ trigger, setData }}/>
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

    const addInput = () => {
        const newInput = {
            type: ontology.inputs.types[0]
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

    const buttons = [{ icon: Icons.add, onClick: addInput }]

    return (
        <Container alt header='Inputs' buttons={buttons}>
            <List selectedItem={selectedIndex} setSelectedItem={setSelectedIndex}>
                {inputs.map((input, index) => {
                    return <ListItem key={index} value={index}>{summarizeInput(input)}</ListItem>
                })}
            </List>
            {input && <Input {...{ input, deleteSelf, data, setData }}/>}
        </Container>
    )
}

const Input = ({ input, deleteSelf, data, setData }) => {
    const { type } = input
    const selectedTab = ontology.inputs.types.indexOf(type)
    const onTabSelected = index => {
        input.type = ontology.inputs.types[index]
        setData('set trigger iput type')
    }

    const buttons = [{ icon: Icons.delete, onClick: deleteSelf }]

    const styles = {
        container: {
            marginTop: '1rem',
            borderTop: '1px solid black'
        }
    }

    return (
        <div style={styles.container}>
            <Container header='Edit Input' buttons={buttons}>
                <Tabs selectedTab={selectedTab} onTabSelected={onTabSelected}>
                    <TabList>
                        <Tab>Key Press</Tab>
                    </TabList>
                    <TabPanel>
                        <KeyPressEditor {...{ input, data, setData }}/>
                    </TabPanel>
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

const Actions = ({ trigger, setData }) => {
    const [selectedIndex, setSelectedIndex] = React.useState(undefined)
    const { actions } = trigger

    const action = selectedIndex === undefined ? undefined: actions[selectedIndex]

    const addAction = () => {
        const newAction = {
            type: ontology.actions.types[0]
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

    const buttons = [{ icon: Icons.add, onClick: addAction }]

    return (
        <Container alt header='Actions' buttons={buttons}>
            <List selectedItem={selectedIndex} setSelectedItem={setSelectedIndex}>
                {actions.map((action, index) => {
                    return <ListItem key={index} value={index}>{summarizeAction(action)}</ListItem>
                })}
            </List>
            {action && <Action {...{ action, deleteSelf, setData }}/>}
        </Container>
    )
}

const Action = ({ action, deleteSelf, setData }) => {
    const { type } = action
    const selectedTab = ontology.actions.types.indexOf(type)
    const onTabSelected = index => {
        action.type = ontology.actions.types[index]
        setData('set trigger action type')
    }

    const buttons = [{ icon: Icons.delete, onClick: deleteSelf }]

    const styles = {
        container: {
            marginTop: '1rem',
            borderTop: '1px solid black'
        }
    }

    return (
        <div style={styles.container}>
            <Container header='Edit Action' buttons={buttons}>
                <Tabs selectedTab={selectedTab} onTabSelected={onTabSelected}>
                    <TabList>
                        <Tab>Cue Advance</Tab>
                        <Tab>Cue Reverse</Tab>
                    </TabList>
                    <TabPanel>
                        <Placeholder>Advance to the next cue</Placeholder>
                    </TabPanel>
                    <TabPanel>
                        <Placeholder>Go back to the previous cue</Placeholder>
                    </TabPanel>
                </Tabs>
            </Container>
        </div>
    )
}
