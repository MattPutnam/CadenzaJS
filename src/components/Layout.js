import React from 'react'
import _ from 'lodash'
import { FaCaretRight, FaCaretDown } from 'react-icons/fa'

import { Button } from './Components'


export const Container = ({ header, buttons, alt, collapse, flex, style, children, ...props }) => {
    const [collapsed, setCollapsed] = React.useState(false)

    const styles = {
        container: {
            flex: collapsed ? 'none' : flex ? flex : '1 1 auto',
            alignSelf: 'stretch',
            backgroundColor: alt ? '#616161' : '#484848',
            border: '1px solid black',
            borderRadius: 3,
            overflow: 'hidden'
        },
        title: {
            fontWeight: 'bold'
        },
        contentContainer: {
            flex: '1 1 auto',
            overflow: 'auto',
            borderTop: '1px solid black'
        },
        caret: {
            alignSelf: 'center',
            cursor: 'pointer',
            marginRight: '0.5rem'
        },
        button: {
            backgroundColor: '#3a3a3a',
            border: '1px solid #2e2e2e',
            margin: '-0.5rem 0 -0.5rem 0.5rem'
        }
    }

    const resolvedTitle = _.isString(header) ? <span style={styles.title}>{header}</span> : header

    return <Flex element='section' column align='stretch' style={_.merge(styles.container, style)} {...props}>
        {(header || buttons) && <Flex pad>
            {collapse && collapsed && <FaCaretRight style={styles.caret} onClick={() => setCollapsed(false)}/>}
            {collapse && !collapsed && <FaCaretDown style={styles.caret} onClick={() => setCollapsed(true)}/>}
            {resolvedTitle}
            {buttons && <>
                <Spacer/>
                {buttons.map((button, index) => {
                    if (button) {
                        const { icon, ...props } = button
                        return <Button key={index} style={styles.button} {...props}>{icon}</Button>
                    }
                    return null
                })}
            </>}
        </Flex>}
        {!collapsed && <div style={styles.contentContainer}>
            {children}
        </div>}
    </Flex>
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

export const Spacer = () => <div style={{ flex: '1 1 auto' }}/>

export const Center = ({ children, ...props }) => {
    return <Flex {...props}>
        <Spacer/>
        {children}
        <Spacer/>
    </Flex>
}
