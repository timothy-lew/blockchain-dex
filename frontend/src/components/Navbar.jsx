import React from 'react'

function Navbar() {
  return (
    <div className="bg-base min-w-full py-8 px-12 flex flex-row justify-between">
      <p>Some Logo</p>
      <button className="bg-gradient-to-l from-buttonBlue from-0% to-buttonPurple to-100% font-bold p-4 text-base rounded-2xl">
        Connect Wallet
      </button>
    </div>
  )
}

export default Navbar