import BigNumber from 'bignumber.js'
import React, { useEffect, useState } from 'react'
import { useAccount, useContractEvent, useContractWrite } from 'wagmi'

import { Navbar } from '../components'
import ConnectWalletBtn from '../components/ConnectWalletBtn'
import { TOKEN_FACTORY_ABI, TOKEN_FACTORY_ADDR } from '../utils/constants'

const defaultErrorState = {
  tokenNameErr: '',
  tokenTickerErr: '',
  tokenSupplyErr: '',
}

const Asset = () => {
  const [tokenName, setTokenName] = useState('')
  const [tokenTicker, setTokenTicker] = useState('')
  const [tokenSupply, setTokenSupply] = useState('')
  const [tokenAddr, setTokenAddr] = useState('')
  const [open, setOpen] = useState(false)
  const [errObj, setErrObj] = useState(defaultErrorState)

  const { address, isConnected } = useAccount()

  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: TOKEN_FACTORY_ADDR,
    abi: TOKEN_FACTORY_ABI,
    functionName: 'deployToken',
    onSuccess(data) {
      console.log('deployTokenSuccess', data.hash)
    }
  })

  useContractEvent({
    address: TOKEN_FACTORY_ADDR,
    abi: TOKEN_FACTORY_ABI,
    eventName: 'TokenDeployed',
    listener(log) {
      console.log(log)
      setTokenAddr(log[0]?.args.tokenAddress)
    }
  })

  const handleFormInputChange = (key, value) => {
    switch (key) {
      case 'tokenName': {
        setTokenName(value)
        break
      }
      case 'tokenTicker': {
        setTokenTicker(value)
        break
      }
      case 'tokenSupply': {
        setTokenSupply(value)
        break
      }
    }
  }

  const submitForm = (event) => {
    event.preventDefault()
    if (!isConnected) return

    const submitFormErr = defaultErrorState

    const tokenSupplyNum = Number(tokenSupply ?? 0)

    // Error Checking 
    if (tokenName === '') {
      submitFormErr.tokenNameErr = 'Token Name cannot be empty'
    }
    if (tokenTicker === '') {
      submitFormErr.tokenTickerErr = 'Token Ticker cannot be empty'
    }
    if (tokenSupplyNum <= 0) {
      submitFormErr.tokenSupplyErr = 'Token Supply must be greater than zero'
    }

    setErrObj(submitFormErr)
    if (submitFormErr.tokenNameErr !== '' || submitFormErr.tokenTickerErr !== '' || submitFormErr.tokenSupplyErr !== '') return

    const tokenSupplyShifted = new BigNumber(tokenSupply).shiftedBy(18).toString(10)
    console.log('Calling deployToken', tokenName, tokenSupply, tokenSupplyShifted)
    write({
      args: [tokenName, tokenTicker, BigInt(tokenSupplyShifted)],
      from: address,
    })

    //Reset Form
    setTokenName('')
    setTokenTicker('')
    setTokenSupply('')
  }

  const closeDiv = () => {
    setTokenAddr('')
    setOpen(false)
  }

  useEffect(() => {
    if (isLoading && !isSuccess) setOpen(true)
  }, [isLoading, isSuccess])

  return (
    <div className="relative bg-gradient-to-b from-baseColor from-28% to-baseSecondaryColor to-75% min-h-screen font-body text-textMain">
      {open && (<div className="absolute w-screen h-screen bg-[#00000066] blur" />)}
      <Navbar />
      <form className="bg-[#0E111B] w-96 mx-auto mt-10 border-2 border-solid border-borderColor rounded-2xl p-8">
        <fieldset className="flex flex-col gap-6 text-2xl">
          <legend className="mb-8 text-center">Asset Issuer Form</legend>
          <div>
            <label htmlFor="text_1">Token Name:</label>
            <input id="text_1" name="tokenName" type="text" value={tokenName} onChange={(event) => handleFormInputChange('tokenName', event.target.value)} className="w-full bg-tertiary p-2 rounded text-right focus:outline-none" />
            {errObj.tokenNameErr !== '' && (<p className='mt-2 text-red-500 font-med'>{errObj.tokenNameErr}</p>)}
          </div>
          <div>
            <label htmlFor="text_2">Token Ticker:</label>
            <input id="text_2" name="tokenTicker" type="text" value={tokenTicker} onChange={(event) => handleFormInputChange('tokenTicker', event.target.value)} className="w-full bg-tertiary p-2 rounded text-right focus:outline-none" />
            {errObj.tokenTickerErr !== '' && (<p className='mt-2 text-red-500 font-med'>{errObj.tokenTickerErr}</p>)}
          </div>
          <div>
            <label htmlFor="text_3">Token Supply:</label>
            <input id="text_3" name="tokenSupply" type="number" value={tokenSupply} onChange={(event) => handleFormInputChange('tokenSupply', event.target.value)} className="w-full bg-tertiary p-2 rounded text-right focus:outline-none" />
            {errObj.tokenSupplyErr !== '' && (<p className='mt-2 text-red-500 font-med'>{errObj.tokenSupplyErr}</p>)}
          </div>
          {isConnected && (
            <button type="submit" onClick={(event) => submitForm(event)} className="bg-[#243056] font-bold py-2.5 px-5 text-[#5981F3] hover:text-[#3b4874] rounded-2xl">
              Create Token
            </button>
          )}
          {!isConnected && (
            <ConnectWalletBtn />
          )}
        </fieldset>
      </form>

      {open && (
        <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-col justify-center items-center bg-[#0E111B] w-[600px] mx-auto mt-10 border-2 border-solid border-borderColor rounded-2xl p-8">
          {isLoading && (
            <div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-blue-600" />
          )}
          {(!isLoading && isSuccess) && (
            <div className="flex flex-col gap-4 text-xl text-center text-textMain">
              <p>Token contract address:</p>
              <p>{tokenAddr.toLowerCase() ?? '0x00'}</p>
              <p>Import into your wallet, to see the new token balance</p>
            </div>
          )}
          <button onClick={closeDiv} className='w-1/2 mt-8 bg-[#243056] self-center font-bold py-2.5 px-5 text-[#5981F3] hover:text-[#3b4874] rounded-2xl'>Close</button>
        </div>
      )}
    </div>
  )
}

export default Asset