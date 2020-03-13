import React from 'react'

const ChannelSelector = ({ id, selected, setSelected }) => {
    return <>
        <label htmlFor={id}>Channel: </label>
        <input id={id}
               type='number'
               value={selected}
               min='0' max='15'
               onChange={e => setSelected(parseInt(e.target.value))}/>
    </>
}

export default ChannelSelector
