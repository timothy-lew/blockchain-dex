import React from 'react'

import { ActiveOrder, Navbar, Order } from './components'

const App = () => {
  return (
    <div className="relative flex flex-col items-center bg-baseColor min-h-screen font-body text-textMain">
      <Navbar />
      <Order />
      <ActiveOrder />
    </div>
  )
}

export default App