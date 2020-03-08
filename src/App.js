import React from 'react'
import NavBar from './components/NavBar'

const App = () => {
  const [selectedTab, setSelectedTab] = React.useState('Setup')

  return <div>
    <NavBar selectedTab={selectedTab} setSelectedTab={setSelectedTab}/>
  </div>
}

export default App
