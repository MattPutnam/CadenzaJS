import React from 'react'
import _ from 'lodash'


export const Flex = React.forwardRef(({ children, column=false, align, pad, style, ...props }, ref) => {
    const myStyle = {
        display: 'flex',
        flexDirection: column ? 'column' : 'row',
        alignItems: align ? align : column ? 'flex-start' : 'baseline',
        alignSelf: 'stretch',
        padding: pad ? '0.5rem' : 0
    }

    return <div ref={ref} style={_.merge(myStyle, style)} {...props}>
        {children}
    </div>
})

export const Spacer = () => <div style={{ flex: '1 1 auto' }}/>

export const Center = ({ children, ...props }) => {
    return <Flex {...props}>
        <Spacer/>
        {children}
        <Spacer/>
    </Flex>
}
