import React from 'react'

const Button = ({ children, onClick }) => {
    let style = {
        margin: '0 0.5rem',
        padding: '0.5rem 0.75rem',
        color: 'white',
        backgroundColor: '#0069c4',
        fontSize: 'unset',
        border: 'unset',
        borderRadius: 3,
        cursor: 'pointer'
    }

    return <button style={style} onClick={onClick}>
        {children}
    </button>
}

export default Button
