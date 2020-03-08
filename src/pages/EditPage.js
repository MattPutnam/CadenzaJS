import React from 'react'
import NavBar from '../components/NavBar'

const EditPage = ({ perform }) => {
    const [selectedTab, setSelectedTab] = React.useState('Setup')

    return <div>
        <NavBar {...{ selectedTab, setSelectedTab, perform }}/>
     </div>
}

export default EditPage
