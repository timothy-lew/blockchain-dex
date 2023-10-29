import React from 'react'
import { Route, Routes } from 'react-router-dom'

import { Navbar, Order } from './components'
import { Home } from './pages'

const App = () => {
  return (
    <div className="relative bg-baseColor min-h-screen font-body text-textMain">
      <div>
        <Navbar />
      </div>
      <div>
        <Order />
      </div>
      {/* <Routes>
        <Route path="/" element={<Home />} />
      </Routes> */}
    </div>
  )
}

export default App