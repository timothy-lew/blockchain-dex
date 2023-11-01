import React from 'react'
import OrderSideTable from './OrderSideTable'

const Orderbook = ({ baseDenom, quoteDenom }) => {

  return (
    <div className="w-1/2">
      <div className="h-[10%] w-full flex flex-row border-r-2 border-solid border-borderColor border-b-2">
        <div className="w-1/3 flex items-center pl-4 text-sm">Price({quoteDenom})</div>
        <div className="w-1/3 flex items-center pl-4 text-sm">Quantity({baseDenom})</div>
        <div className="w-1/3 flex items-center justify-center text-sm text-center">Total</div>
      </div>
      <OrderSideTable side='sell' />
      <div className="bg-tertiary h-[10%] w-full pl-4 flex items-center border-r-2 border-solid border-borderColor ">Last Price</div>
      <OrderSideTable side='buy' />
    </div>
  )
}

export default Orderbook