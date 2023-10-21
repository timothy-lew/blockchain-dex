import React from 'react'
import { Route, Routes } from 'react-router-dom'

import { Navbar, OrderForm } from './components'
import { Home } from './pages'

const App = () => {
  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div>
        <OrderForm />
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  )
}

export default App