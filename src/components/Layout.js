import React from 'react'
import _ from 'lodash'


export const Flex = React.forwardRef(({ children, column=false, align, pad, style, element='div', ...props }, ref) => {
    const type = column ? 'column' : 'row'

    const myStyle = {
        display: 'flex',
        flexDirection: type,
        alignItems: align ? align : column ? 'flex-start' : 'baseline',
        alignSelf: 'stretch',
        padding: pad ? '0.5rem' : 0
    }

    const className = `flex ${type}`

    return React.createElement(
        element,
        {
            ref,
            className,
            style: _.merge(myStyle, style),
            ...props
        },
        children
    )
})

export const Spacer = ({ width }) => <div style={{ flex: (width === undefined ? '1 1 auto' : `0 0 ${width}px`) }}/>

export const Center = ({ children, ...props }) => {
    return (
        <Flex {...props}>
            <Spacer/>
            {children}
            <Spacer/>
        </Flex>
    )
}
