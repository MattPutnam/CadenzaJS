import React from 'react'
import _ from 'lodash'


export const Container = ({ header, buttons, alt, flex, style, children, ...props }) => {
    const styles = {
        container: {
            flex: flex ? flex : '1 1 auto',
            alignSelf: 'stretch',
            backgroundColor: alt ? '#616161' : '#484848',
            border: '1px solid black',
            borderRadius: 3,
            overflow: 'hidden'
        },
        header: {
            padding: '0.5rem',
            borderBottom: '1px solid black'
        },
        title: {
            fontWeight: 'bold'
        },
        contentContainer: {
            flex: '1 1 auto',
            overflow: 'auto'
        }
    }

    const resolvedTitle = _.isString(header) ? <span style={styles.title}>{header}</span> : header

    return <Flex element='section' column align='stretch' style={_.merge(styles.container, style)} {...props}>
        {(header || buttons) && <Flex style={styles.header}>
            {resolvedTitle}
            {buttons && <>
                <Spacer/>
                {buttons}
            </>}
        </Flex>}
        <div style={styles.contentContainer}>
            {children}
        </div>
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
