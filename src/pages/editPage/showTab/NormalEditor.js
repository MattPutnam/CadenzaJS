import React from 'react'

import Transpose from '../../../components/Transpose'


const NormalEditor = ({ patchUsage, setData }) => {
    return <>
        <Transpose alt object={patchUsage.attributes} setData={setData}/>
        {/* TODO: monophonic */}
    </>
}

export default NormalEditor