import React from 'react'
import _ from 'lodash'

import Colors from './colors'


const Button = ({ children, onClick, iconButton, style }) => {
    const myStyle = {
        marginLeft: '0.5rem',
        padding: iconButton ? '0.5rem 0.6rem' : '0.5rem 0.75rem',
        color: 'white',
        backgroundColor: Colors.blue,
        fontSize: 'unset',
        border: '1px solid #1A3552',
        borderRadius: 3,
        cursor: 'pointer'
    }

    return <button style={_.merge(myStyle, style)} onClick={onClick}>
        {children}
    </button>
}

export default Button
