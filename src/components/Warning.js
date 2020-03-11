import React from 'react'

const Warning = ({ children }) => {
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

export default Warning
