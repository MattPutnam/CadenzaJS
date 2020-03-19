import React from 'react'
import _ from 'lodash'

import Colors from './colors'
import { Flex } from './Layout'


export const Button = ({ children, small, disabled, onClick, style }) => {
    const bigStyle = {
        marginLeft: '0.5rem',
        padding: '0.5rem 0.75rem',
        color: disabled ? 'gray' : 'white',
        backgroundColor: Colors.blue,
        fontSize: 'unset',
        border: '1px solid #1A3552',
        borderRadius: 3,
        cursor: disabled ? undefined : 'pointer'
    }

    const smallStyle = {
        backgroundColor: '#3A3A3A',
        color: disabled ? 'gray' : 'white',
        border: '1px solid #2E2E2E',
        borderRadius: 3,
        cursor: disabled ? undefined : 'pointer',
        margin: '-0.5rem 0 -0.5rem 0.5rem',
        padding: '0.25rem 0.75rem'
    }

    return <button disabled={disabled} style={_.merge(small ? smallStyle : bigStyle, style)} onClick={onClick}>
        {children}
    </button>
}

export const Message = ({ children, error }) => {
    const style = {
        margin: '0 0.5rem',
        padding: '0.5rem 0.75rem',
        backgroundColor: error ? '#D93025' : '#8F8F8F',
        border: '1px solid black',
        borderRadius: 3
    }

    return <div style={style}>
        {children}
    </div>
}

export const Warning = ({ children }) => {
    const style = {
        color: '#F5BE02',
        backgroundColor: '#FFFCE5',
        border: '1px solid #F5BE02',
        borderRadius: 3,
        padding: '2px 0.5rem',
        margin: '0.5rem'
    }

    return <span style={style}>{children}</span>
}

export const Placeholder = ({ width='100%', height='100%', children }) => {
    const style = {
        justifyContent: 'center',
        height: height,
        width: width
    }

    return <Flex align='center' style={style}>
        {children}
    </Flex>
}
