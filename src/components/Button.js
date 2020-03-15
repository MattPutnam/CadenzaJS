import React from 'react'

import Colors from './colors'


const Button = ({ children, onClick, iconButton }) => {
    const style = {
        marginLeft: '0.5rem',
        padding: iconButton ? '0.5rem 0.6rem' : '0.5rem 0.75rem',
        color: 'white',
        backgroundColor: Colors.blue,
        fontSize: 'unset',
        border: '1px solid #1A3552',
        borderRadius: 3,
        cursor: 'pointer'
    }

    return <button style={style} onClick={onClick}>
        {children}
    </button>
}

export default Button
