import React from 'react'
import _ from 'lodash'

import Colors from './Colors'
import { Button, ButtonLike } from './Components'
import Icons, { icon } from './Icons'


export const Container = ({ header, postHeader, buttons, alt, collapse, startCollapsed, flex, style, children, ...props }) => {
    const [collapsed, setCollapsed] = React.useState(!!startCollapsed)

    const styles = {
        container: {
            flex: collapsed ? 'none' : flex ? flex : '1 1 auto',
            alignSelf: 'stretch',
            backgroundColor: alt ? Colors.gray[3] : Colors.gray[2],
            border: '1px solid black',
            borderRadius: 3,
            overflow: 'hidden'
        },
        title: {
            fontWeight: 'bold'
        },
        contentContainer: hasHeader => ({
            display: collapsed ? 'none' : undefined,
            flex: '1 1 auto',
            overflow: 'auto',
            borderTop: hasHeader ? '1px solid black' : undefined
        }),
        caret: {
            width: 'unset',
            alignSelf: 'center',
            cursor: 'pointer',
            marginRight: '0.5rem'
        },
        button: {
            backgroundColor: Colors.gray[1],
            border: `1px solid ${Colors.gray[0]}`,
            margin: '-0.5rem 0 -0.5rem 0.5rem'
        }
    }

    const hasHeader = header || buttons
    const resolvedTitle = _.isString(header) ? <span style={styles.title}>{header}</span> : header

    return (
        <Flex element='section' column align='stretch' style={_.merge(styles.container, style)} {...props}>
            {hasHeader && <Flex pad>
                {collapse && collapsed && <ButtonLike style={styles.caret} onClick={() => setCollapsed(false)}>{icon(Icons.collapsed)}</ButtonLike>}
                {collapse && !collapsed && <ButtonLike style={styles.caret} onClick={() => setCollapsed(true)}>{icon(Icons.expanded)}</ButtonLike>}
                {resolvedTitle}
                {postHeader}
                {buttons && !collapsed && <>
                    <Spacer/>
                    {buttons.map((button, index) => {
                        if (button) {
                            const { icon, ...props } = button
                            return <Button key={index} style={styles.button} {...props}>{React.createElement(icon)}</Button>
                        }
                        return null
                    })}
                </>}
            </Flex>}
            <div style={styles.contentContainer(hasHeader)}>
                {children}
            </div>
        </Flex>
    )
}

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
