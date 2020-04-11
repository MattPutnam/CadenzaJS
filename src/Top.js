import React from 'react'

import EditPage from './pages/EditPage'
import PerformPage from './pages/PerformPage'


const Top = ({ midiInterfaces, data, setData }) => {
    const [perform, setPerform] = React.useState(false)

    return perform ?
        <PerformPage exit={() => setPerform(false)}/> :
        <EditPage perform={() => setPerform(true)} {...{ midiInterfaces, data, setData }}/>
}

export default Top
