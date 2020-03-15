import React from 'react'


const Message = ({ children, error }) => {
    const style = {
        margin: '0 0.5rem',
        padding: '0.5rem 0.75rem',
        backgroundColor: error ? '#D93025' : '#8F8F8F',
        color: 'white',
        border: '1px solid black',
        borderRadius: 3
    }

    return <div style={style}>
        {children}
    </div>
}

export default Message
