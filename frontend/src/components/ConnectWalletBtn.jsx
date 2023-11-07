import React from 'react'
import { useConnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'


const ConnectWalletBtn = ({ classStyle = '' }) => {
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  return (
    <button type="button" onClick={() => connect()} className={`bg-[#243056] font-bold py-2.5 px-5 text-[#5981F3] hover:text-[#3b4874] rounded-2xl ${classStyle}`}>
      Connect Wallet
    </button>
  )
}

export default ConnectWalletBtn