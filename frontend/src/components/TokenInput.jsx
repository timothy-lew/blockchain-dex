import React from 'react'

const TokenInput = ({ isBuySide = false, balance = 0, tokenTicker = 'Token Ticker', tokenName = "Token Name" }) => {
  return (
    <div className='w-448px py-3 px-4 bg-baseColor rounded-2xl'>
      <div className='flex flex-row justify-between text-textSecondary'>
        <div>{isBuySide ? "You buy" : "You sell"}</div>
        <div>Balance: {balance}</div>
      </div>
      <div className='flex flex-row justify-between my-2'>
        <div className='my-auto text-2xl'>{tokenTicker}</div>
        <input className='w-1/2 bg-baseColor text-2xl text-right focus:outline-none' />
      </div>
      <div className='text-textSecondary'>{tokenName}</div>
    </div>
  )
}

export default TokenInput