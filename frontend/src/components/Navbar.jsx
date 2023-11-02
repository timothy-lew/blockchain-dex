import React from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

import Metamask from '../assets/Metamask.svg'
import Disconnect from '../assets/Disconnect.svg'

function Navbar() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const { disconnect } = useDisconnect()
  return (
    <div className="bg-base min-w-full flex flex-row justify-between items-center px-12 py-6">
      <p>Some Logo</p>
      {!isConnected && (
        <button onClick={() => connect()} className="bg-[#243056] font-bold py-2.5 px-5 text-[#5981F3] hover:text-[#3b4874] rounded-2xl">
          Connect Wallet
        </button>
      )}
      {isConnected && (
        <div className='bg-secondary h-full flex flex-row items-center p-3 rounded'>
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