import React, { useState } from 'react'
import { useContractReads } from 'wagmi'

import OrderSideTable from './OrderSideTable'

import { ORDER_CONTRACT_ADDR, orderbookABI } from '../utils/constants'

const Orderbook = ({ baseDenom, quoteDenom, baseTokenAddress, quoteTokenAddress }) => {
  const [buyOrders, setBuyOrders] = useState([])
  const [sellOrders, setSellOrders] = useState([])

  const orderbookContract = {
    address: ORDER_CONTRACT_ADDR,
    abi: orderbookABI,
  }

  useContractReads({
    contracts: [
      {
        ...orderbookContract,
        functionName: 'getBuyOrders'
      },
      {
        ...orderbookContract,
        functionName: 'getSellOrders'
      }
    ],
    watch: true,
    onSuccess(data) {
      const lowerCaseBaseTokenAddr = baseTokenAddress.toLowerCase()
      const lowerCaseQuoteTokenAddr = quoteTokenAddress.toLowerCase()
      const currentMarketBuyOrders = data[0].result.filter((order) => {
        if (order.baseToken.toLowerCase() === lowerCaseBaseTokenAddr && order.quoteToken.toLowerCase() === lowerCaseQuoteTokenAddr && !order.isFilled) return true
        return false
      })
      const currentMarketSellOrders = data[1].result.filter((order) => {
        if (order.baseToken.toLowerCase() === lowerCaseBaseTokenAddr && order.quoteToken.toLowerCase() === lowerCaseQuoteTokenAddr && !order.isFilled) return true
        return false
      })
      currentMarketBuyOrders.sort((beforeOrder, afterOrder) => {
        const beforePrice = BigInt(beforeOrder.price)
        const afterPrice = BigInt(afterOrder.price)
        if (beforePrice < afterPrice) return 1
        if (beforePrice > afterPrice) return -1
        return 0
      })
      currentMarketSellOrders.sort((beforeOrder, afterOrder) => {
        const beforePrice = BigInt(beforeOrder.price)
        const afterPrice = BigInt(afterOrder.price)
        if (beforePrice < afterPrice) return -1
        if (beforePrice > afterPrice) return 1
        return 0
      })
      console.log('xxxBuy', data[0].result)
      console.log('xxxSell', data[1].result)
      setBuyOrders(currentMarketBuyOrders)
      setSellOrders(currentMarketSellOrders)
    }
  })

  return (
    <div className="w-1/2">
      <div className="h-[10%] w-full flex flex-row border-r-2 border-solid border-borderColor border-b-2">
        <div className="w-1/3 flex items-center pl-4 text-sm">Price({quoteDenom})</div>
        <div className="w-1/3 flex items-center pl-4 text-sm">Quantity({baseDenom})</div>
        <div className="w-1/3 flex items-center justify-center text-sm text-center">Total({quoteDenom})</div>
      </div>
      <OrderSideTable
        side='sell'
        rows={sellOrders}
      />
      <div className="bg-tertiary h-[10%] w-full pl-4 flex items-center border-r-2 border-solid border-borderColor ">Last Price</div>
      <OrderSideTable
        side='buy'
        rows={buyOrders}
      />
    </div>
  )
}

export default Orderbook