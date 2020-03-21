import React from 'react'
import _ from 'lodash'
import { v4 as uuid } from 'uuid'

import Colors from './colors'
import { Flex } from './Layout'


export const Button = ({ large, disabled, onClick, style, children }) => {
    const myStyle = {
        margin: '-0.5rem 0 -0.5rem 0.5rem',
        padding: large ? '0.5rem 0.75rem' : '2px 0.75rem',
        color: disabled ? 'gray' : 'white',
        backgroundColor: Colors.blue,
        fontSize: 'unset',
        border: '1px solid #1A3552',
        borderRadius: 3,
        cursor: disabled ? undefined : 'pointer'
    }

    return <button disabled={disabled} style={_.merge(myStyle, style)} onClick={onClick}>
        {children}
    </button>
}

export const Checkbox = ({ checked, onChange }) => {
    return <input type='checkbox' checked={checked} onChange={e => onChange(e.target.checked)}/>
}

export const Label = ({ htmlFor, children }) => {
    const style = {
        marginRight: '0.5rem'
    }

    return <label htmlFor={htmlFor} style={style}>{children}</label>
}

export const Message = ({ children, error }) => {
    const style = {
        margin: '0 0.5rem',
        padding: '0.5rem 0.75rem',
        backgroundColor: error ? '#D93025' : '#8F8F8F',
        border: '1px solid black',
        borderRadius: 3
    }

    return <div style={style}>
        {children}
    </div>
}

export const NumberField = ({ value, setValue, min=0, max, label, style }) => {
    let id
    if (label) {
        id = uuid()
    }

    return <>
        {label && <Label htmlFor={id}>{label}</Label>}
        <input id={id} type='number' value={value} min={min} max={max} style={style} onChange={e => setValue(parseInt(e.target.value))}/>
    </>
}

export const Placeholder = ({ width='100%', height='100%', children }) => {
    const style = {
        justifyContent: 'center',
        height: height,
        width: width
    }

    return <Flex align='center' style={style}>
        {children}
    </Flex>
}

export const Select = ({ options, selected, setSelected, render=(x => x), label }) => {
    let id
    if (label) {
        id = uuid()
    }

    return <>
        {label && <Label htmlFor={id}>{label}</Label>}
        <select id={id} value={selected} onChange={e => setSelected(e.target.value)}>
            {options.map((option, index) => {
                return <option value={option} key={index}>{render(option)}</option>
            })}
        </select>
    </>
}

export const TextField = ({ value, setValue, size, label, style }) => {
    let id
    if (label) {
        id = uuid()
    }

    return <>
        {label && <Label htmlFor={id}>{label}</Label>}
        <input id={id} type='text' value={value} size={size} style={style} onChange={e => setValue(e.target.value)}/>
    </>
}

export const Warning = ({ children }) => {
    const style = {
        color: '#F5BE02',
        backgroundColor: '#FFFCE5',
        border: '1px solid #F5BE02',
        borderRadius: 3,
        padding: '2px 0.5rem',
        margin: '-0.5rem 0.5rem'
    }

    return <span style={style}>{children}</span>
}
