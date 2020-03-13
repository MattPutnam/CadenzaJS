import React from 'react'

const ChannelSelector = ({ keyboard, setSelected }) => {
    const id = `channelSelectorFor${keyboard.id}`
    return <>
        <label htmlFor={id}>Channel: </label>
        <input id={id}
               type='number'
               value={keyboard.channel}
               min='0' max='15'
               onChange={e => setSelected(parseInt(e.target.value))}/>
    </>
}

export default ChannelSelector
