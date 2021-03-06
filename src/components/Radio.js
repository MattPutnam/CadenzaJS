import React from 'react'
import { v4 as uuid } from 'uuid'

import { Flex } from './Layout'


export const RadioButtonGroup = ({ selected, onSelected, children }) => {
    const groupName = uuid()

    return (
        <Flex column>
            {React.Children.map(children, (child, index) => {
                return React.cloneElement(child, {
                    checked: selected === index,
                    groupName,
                    onClick: () => onSelected(index)
                })
            })}
        </Flex>
    )
}

export const RadioButton = ({ checked, groupName, onClick, children }) => {
    const id = uuid()

    const style = {
        cursor: 'pointer'
    }

    return (
        <Flex pad>
            <input type='radio' id={id} name={groupName} onChange={onClick} checked={checked} style={style}/>
            <label htmlFor={id} style={style}>{children}</label>
        </Flex>
    )
}
