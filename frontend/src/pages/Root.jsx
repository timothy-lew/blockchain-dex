import React from 'react'

import { Navbar, Order } from '../components'

const App = () => {
  return (
    <div className="relative flex flex-col items-center bg-gradient-to-b from-baseColor from-28% to-baseSecondaryColor to-75% min-h-screen font-body text-textMain">
      <Navbar />
      <Order />
    </div>
  )
}

export default App