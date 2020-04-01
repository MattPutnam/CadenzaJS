import React from 'react'
import _ from 'lodash'

import Colors from './Colors'
import { ButtonLike } from './Components'
import Icons, { icon } from './Icons'
import { Flex } from './Layout'


export const List = ({ selectedItem, setSelectedItem, children }) => {
    const style = {
        alignSelf: 'stretch',
        overflowY: 'auto',
    }

    return (
        <div style={style}>
            {React.Children.map(children, child => {
                return React.cloneElement(child, { selectedItem, setSelectedItem })
            })}
        </div>
    )
}

export const ListItem = ({ value, selectedItem, setSelectedItem, children }) => {
    const selected = _.isEqual(selectedItem, value)

    const style = {
        alignSelf: 'stretch',
        margin: '3px 0',
        backgroundColor: selected ? Colors.blue[2] : undefined,
        paddingLeft: '0.5rem',
        cursor: 'pointer'
    }

    return (
        <ButtonLike style={style} onClick={() => setSelectedItem(selected ? undefined : value)}>
            {children}
        </ButtonLike>
    )
}

export const ListSection = ({ title, value, selectedItem, setSelectedItem, children }) => {
    const [collapsed, setCollapsed] = React.useState(false)

    const selected = _.isEqual(selectedItem, value)

    const styles = {
        container: {
            alignSelf: 'stretch',
            margin: '3px 0',
            fontWeight: selected ? 'bold' : undefined,
            backgroundColor: selected ? Colors.blue[2] : Colors.gray[1],
            cursor: 'pointer'
        },
        title: {
            flex: '1 1 auto',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        },
        caret: {
            flex: 'none',
            margin: '0 0.25rem'
        }
    }

    const keyCollapse = e => {
        if (e.key === 'ArrowRight') {
            setCollapsed(false)
        } else if (e.key === 'ArrowLeft') {
            setCollapsed(true)
        } else if (e.key === ' ' || e.key === 'Enter') {
            setCollapsed(!collapsed)
        }
    }

    const caretProps = {
        style: styles.caret,
        tabIndex: 0,
        onKeyDown: keyCollapse,
        onClick: () => setCollapsed(!collapsed)
    }

    return <>
        <Flex align='center'
              style={styles.container}
              onKeyDown={keyCollapse}>
            {icon(collapsed ? Icons.collapsed : Icons.expanded, caretProps)}
            <ButtonLike style={styles.title} onClick={() => setSelectedItem(selected ? undefined : value)}>
                {title}
            </ButtonLike>
        </Flex>
        {!collapsed && React.Children.map(children, child => {
            return React.cloneElement(child, { selectedItem, setSelectedItem })
        })}
    </>
}
