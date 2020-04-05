import React from 'react'
import _ from 'lodash'

import Colors from './Colors'
import { Button, ButtonLike } from './Components'
import Icons, { icon } from './Icons'
import { Flex, Spacer } from './Layout'


export const Container = ({ alt, collapse, startCollapsed, flex, style, children, ...props }) => {
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
        contentContainer: hasHeader => ({
            display: collapsed ? 'none' : undefined,
            flex: '1 1 auto',
            overflow: 'auto',
            borderTop: hasHeader ? '1px solid black' : undefined
        })
    }

    const childrenArray = React.Children.toArray(children)

    const headerChild = _.filter(childrenArray, child => child.type === Header)[0]
    const nonHeaderChildren = _.filter(childrenArray, child => child.type !== Header)

    return (
        <Flex element='section' column align='stretch' style={_.merge(styles.container, style)} {...props}>
            {headerChild && React.cloneElement(headerChild, { collapse, collapsed, setCollapsed })}
            <div style={styles.contentContainer(!!headerChild)}>
                {nonHeaderChildren}
            </div>
        </Flex>
    )
}


export const Header = ({ collapse, collapsed, setCollapsed, children }) => {
    const childrenArray = React.Children.toArray(children)

    const buttonChildren = _.filter(childrenArray, child => child.type && child.type.name === 'HeaderButton')
    const nonButtonChildren = _.filter(childrenArray, child => !child.type || child.type.name !== 'HeaderButton')

    const caretStyle = {
        width: 'unset',
        alignSelf: 'center',
        cursor: 'pointer',
        marginRight: '0.5rem'
    }

    return (
        <Flex pad>
            {collapse && collapsed && <ButtonLike style={caretStyle} onClick={() => setCollapsed(false)}>{icon(Icons.collapsed)}</ButtonLike>}
            {collapse && !collapsed && <ButtonLike style={caretStyle} onClick={() => setCollapsed(true)}>{icon(Icons.expanded)}</ButtonLike>}
            {nonButtonChildren}
            {!_.isEmpty(buttonChildren) && <Spacer/>}
            {!collapsed && buttonChildren}
        </Flex>
    )
}

export const Title = ({ children }) => {
    const style = {
        fontWeight: 'bold'
    }

    return <span style={style}>{children}</span>
}

export const HeaderButton = ({ icon, ...props }) => {
    const style = {
        backgroundColor: Colors.gray[1],
        border: `1px solid ${Colors.gray[0]}`,
        margin: '-0.5rem 0 -0.5rem 0.5rem'
    }

    return <Button style={style} {...props}>{React.createElement(icon)}</Button>
}
