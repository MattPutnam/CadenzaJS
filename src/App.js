import React from 'react'
import EditPage from './pages/EditPage'
import PerformPage from './pages/PerformPage'

const App = () => {
  const [perform, setPerform] = React.useState(false)

  return perform ?
    <PerformPage exit={() => setPerform(false)}/> :
    <EditPage perform={() => setPerform(true)}/>
}

export default App
