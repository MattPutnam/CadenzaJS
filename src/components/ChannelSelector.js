import React from 'react'

const ChannelSelector = ({ keyboard, setData }) => {
    const id = `channelSelectorFor${keyboard.id}`
    return <>
        <label htmlFor={id}>Channel: </label>
        <input id={id}
               type='number'
               value={keyboard.channel}
               min='0' max='15'
               onChange={e => {keyboard.channel = parseInt(e.target.value); setData()}}/>
    </>
}

export default ChannelSelector
