import React from 'react'

import { Navbar, Order } from './components'

const App = () => {
  return (
    <div className="relative bg-baseColor min-h-screen font-body text-textMain">
      <Navbar />
      <Order />
    </div>
  )
}

export default App