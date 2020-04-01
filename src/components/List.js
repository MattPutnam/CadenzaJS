import React from 'react'

import Colors from './Colors'
import { ButtonLike } from './Components'


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
    const selected = selectedItem === value

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
