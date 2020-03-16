import React from 'react'
import _ from 'lodash'


export const Flex = React.forwardRef(({ children, align='baseline', style, ...props }, ref) => {
    const myStyle = {
        display: 'flex',
        alignItems: align
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
