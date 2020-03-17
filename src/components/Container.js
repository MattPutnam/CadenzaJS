import React from 'react'
import _ from 'lodash'
import { Flex, Spacer } from './Flex'


const Container = ({ title, buttons, style, inner, children, flex, ...props }) => {
    const styles = {
        container: {
            flex: flex ? flex : '1 1 auto',
            alignSelf: 'stretch',
            backgroundColor: inner ? '#616161' : '#484848',
            border: '1px solid black',
            borderRadius: 3
        },
        header: {
            padding: '0.5rem',
            borderBottom: '1px solid black'
        },
        title: {
            fontWeight: 'bold'
        }
    }

    const resolvedTitle = _.isString(title) ? <span style={styles.title}>{title}</span> : title

    return <Flex element='section' column style={_.merge(styles.container, style)} {...props}>
        {(title || buttons) && <Flex style={styles.header}>
            {resolvedTitle}
            {buttons && <>
                <Spacer/>
                {buttons}
            </>}
        </Flex>}
        {children}
    </Flex>
}

export default Container


export const ContainerButton = ({ onClick, children }) => {
    const style = {
        backgroundColor: '#3A3A3A',
        color: 'white',
        border: '1px solid #2E2E2E',
        borderRadius: 3,
        cursor: 'pointer',
        margin: '-0.5rem 0 -0.5rem 0.5rem',
        padding: '0.25rem 0.75rem'
    }

    return <button style={style} onClick={onClick}>{children}</button>
}
