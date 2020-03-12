import React from 'react'
import _ from 'lodash'


export const Flex = ({ children, align='baseline', style, ...props }) => {
    const myStyle = {
        display: 'flex',
        alignItems: align
    }

    return <div style={_.merge(myStyle, style)} {...props}>
        {children}
    </div>
}

export const Spacer = () => <div style={{ flex: '1 1 auto' }}/>
