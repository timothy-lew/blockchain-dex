import React from 'react'
import { Link } from "react-router-dom"
import { useAccount, useDisconnect } from 'wagmi'

import Disconnect from '../assets/Disconnect.svg'
import Metamask from '../assets/Metamask.svg'
import ConnectWalletBtn from './ConnectWalletBtn'

function Navbar() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  return (
    <div className="bg-base min-w-full flex flex-row items-center px-12 py-6">
      <p>Some Logo</p>
      <Link to="/" className="ml-16 text-xl hover:bg-[#222a3a] cursor-pointer px-4 py-2 rounded font-medium duration-300">
        Trade
      </Link>
      <Link to="/asset" className="ml-16 text-xl hover:bg-[#222a3a] cursor-pointer px-4 py-2 rounded font-medium duration-300">
        Asset
      </Link>
      {!isConnected && (
        <ConnectWalletBtn classStyle="ml-auto" />
      )}
      {isConnected && (
        <div className='bg-secondary h-full flex flex-row items-center p-3 rounded ml-auto'>
          <img src={Metamask} width="24px" />
          <div className="ml-2 font-bold">{address.slice(0, 6)}...{address.slice(address.length - 5)}</div>
          <button className="ml-2" onClick={() => disconnect()}>
            <img src={Disconnect} />
          </button>
        </div>
      )}
    </div>
  )
}

export default Navbar