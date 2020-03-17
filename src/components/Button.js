import React from 'react'
import _ from 'lodash'

import Colors from './colors'


const Button = ({ children, small, onClick, style }) => {
    const bigStyle = {
        marginLeft: '0.5rem',
        padding: '0.5rem 0.75rem',
        color: 'white',
        backgroundColor: Colors.blue,
        fontSize: 'unset',
        border: '1px solid #1A3552',
        borderRadius: 3,
        cursor: 'pointer'
    }

    const smallStyle = {
        backgroundColor: '#3A3A3A',
        color: 'white',
        border: '1px solid #2E2E2E',
        borderRadius: 3,
        cursor: 'pointer',
        margin: '-0.5rem 0 -0.5rem 0.5rem',
        padding: '0.25rem 0.75rem'
    }

    return <button style={_.merge(small ? smallStyle : bigStyle, style)} onClick={onClick}>
        {children}
    </button>
}

export default Button
