import React from 'react'
import _ from 'lodash'

import Colors from './Colors'
import { ButtonLike } from './Components'
import { Flex } from './Layout'


export const Tabs = ({ initial=0, onTabSelected, children }) => {
    const [selectedTab, setSelectedTab] = React.useState(initial)

    const tabList = _.find(children, child => child.type.name === 'TabList')
    const tabPanels = _.filter(children, child => child.type.name !== 'TabList')

    const setTab = index => {
        if (onTabSelected) {
            onTabSelected(index)
        }
        setSelectedTab(index)
    }

    return (
        <div>
            <TabList>
                {React.Children.map(tabList.props.children, (tab, index) => {
                    return React.cloneElement(tab, {
                        selected: index === selectedTab,
                        onSelect: () => setTab(index)
                    })
                })}
            </TabList>
            {React.Children.map(tabPanels, (panel, index) => {
                return React.cloneElement(panel, {
                    selected: index === selectedTab
                })
            })}
        </div>
    )
}

export const TabList = ({ children }) => {
    const style = {
        borderBottom: '1px solid black'
    }

    return <Flex style={style}>{children}</Flex>
}

export const Tab = ({ selected, onSelect, children }) => {
    const style = selected => ({
        flex: '0 0 150px',
        padding: '0.5rem 0.75rem',
        backgroundColor: selected ? Colors.blue[2] : undefined,
        cursor: 'pointer',
        borderRight: '1px solid black'
    })

    return (
        <ButtonLike style={style(selected)} onClick={onSelect}>
            {children}
        </ButtonLike>
    )
}

export const TabPanel = ({ selected, children }) => {
    const style = selected => ({
        display: selected ? 'contents' : 'none'
    })

    return (
        <div style={style(selected)}>
            {children}
        </div>
    )
}
