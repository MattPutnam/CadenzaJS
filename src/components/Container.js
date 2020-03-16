import React from 'react'
import _ from 'lodash'
import { Flex, Spacer } from './Flex'


const Container = ({ title, buttons, style, inner, children, padContent=true, flex, ...props }) => {
    const styles = {
        container: {
            flex: flex ? flex : '1 1 auto',
            margin: '0.5rem',
            backgroundColor: inner ? '#616161' : '#484848',
            border: '1px solid black',
            borderRadius: 3,
            color: '#cecece'
        },
        header: {
            padding: '0.5rem',
            color: 'white',
            borderBottom: '1px solid black'
        },
        title: {
            margin: 0
        },
        content: {
            padding: padContent ? '0.5rem' : undefined
        }
    }

    return <div style={_.merge(styles.container, style)} {...props}>
        <Flex style={styles.header}>
            <h5 style={styles.title}>{title}</h5>
            {buttons && <>
                <Spacer/>
                {buttons}
            </>}
        </Flex>
        <div style={styles.content}>{children}</div>
    </div>
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
