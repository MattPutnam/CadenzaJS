import React from 'react'


export const Flex = ({ children, align='baseline', ...props }) => {
    const style = {
        display: 'flex',
        alignItems: align
    }

    return <div style={style}>
        {children}
    </div>
}

export const Spacer = () => <div style={{ flex: '1 1 auto' }}/>
