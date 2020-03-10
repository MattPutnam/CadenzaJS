import React from 'react'
import _ from 'lodash'

const Container = ({ title, style, inner, children }) => {
    const styles = {
        container: {
            margin: '0.5rem',
            backgroundColor: inner ? '#616161' : '#484848',
            border: '1px solid black',
            borderRadius: 3
        },
        title: {
            margin: 0,
            padding: '0.5rem',
            color: 'white',
            borderBottom: '1px solid black'
        },
        content: {
            padding: '0.5rem'
        }
    }

    return <div style={_.merge(styles.container, style)}>
        {title && <h5 style={styles.title}>{title}</h5>}
        <div style={styles.content}>{children}</div>
    </div>
}

export default Container
