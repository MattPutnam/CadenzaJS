import React from 'react'

import { NumberField } from '../../../components/Components';


const ChannelSelector = ({ keyboard, setData }) => {
    const setChannel = channel => {
        keyboard.channel = channel-1
        setData()
    }

    return <NumberField label='Channel:' value={keyboard.channel+1} max={16} setValue={setChannel}/>
}

export default ChannelSelector
