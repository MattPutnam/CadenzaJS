import React from 'react'

const ChannelSelector = ({ keyboard, setData }) => {
    const id = `channelSelectorFor${keyboard.id}`
    return <>
        <label htmlFor={id}>Channel: </label>
        <input id={id}
               type='number'
               value={keyboard.channel+1}
               min='1' max='16'
               onChange={e => {keyboard.channel = parseInt(e.target.value)-1; setData()}}/>
    </>
}

export default ChannelSelector
