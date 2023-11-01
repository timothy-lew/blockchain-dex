import React, { useState } from 'react'
import { useAccount, useBalance, useContractWrite } from 'wagmi'

import MarketDropDown from './MarketDropDown'
import NumberInput from './NumberInput'
import Orderbook from './Orderbook'

import ChangeSideIcon from '../assets/ChangeSideIcon.svg'
import { orderbookABI } from '../utils/abis'
import marketsJson from '../utils/markets/markets.json'

const defaultFormState = {
  inputPrice: '',
  inputQuantity: '',
  inputTotal: '',
  price: 0,
  quantity: 0,
  total: 0,
}

const markets = marketsJson.markets

function Order() {
  const [formState, setFormState] = useState(defaultFormState)
  const [isBuySide, setIsBuySide] = useState(true)
  const [marketIndex, setMarketIndex] = useState(0)

  const { address, isConnected } = useAccount()

  const { baseTokenAddress, quoteTokenAddress } = markets[marketIndex]
  const { data: baseTokenBalance } = useBalance({ address: address, token: baseTokenAddress === '' ? undefined : baseTokenAddress })
  const { data: quoteTokenBalance } = useBalance({ address: address, token: quoteTokenAddress === '' ? undefined : quoteTokenAddress })

  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: '0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9',
    abi: orderbookABI,
    functionName: 'placeBuyOrder',
  })

  const handleFormChange = (key = '', value = '') => {
    const numberValue = Number(value) ?? 0

    switch (key) {
      case 'price': {
        setFormState({
          ...formState,
          inputPrice: value,
          price: numberValue,
          ...formState.quantity && {
            inputTotal: `${numberValue * formState.quantity}`,
            total: numberValue * formState.quantity,
          },
        })
        break
      }
      case 'quantity': {
        setFormState({
          ...formState,
          inputQuantity: value,
          quantity: numberValue,
          ...formState.price && {
            inputTotal: `${formState.price * numberValue}`,
            total: formState.price * numberValue
          },
        })
        break
      }
      case 'total': {
        setFormState({
          ...formState,
          inputTotal: value,
          total: numberValue,
          ...formState.price !== 0 && {
            inputQuantity: `${numberValue / formState.price}`,
            quantity: numberValue / formState.price
          },
        })
        break
      }
      default:
        break
    }
  }

  const selectMarketIndex = (marketIndex) => {
    setMarketIndex(marketIndex)
    setFormState(defaultFormState)
    return
  }

  const submitOrder = () => {
    if (formState.price === 0 || formState.quantity === 0) return

    const quoteTokenBalanceFormatted = parseFloat(quoteTokenBalance.formatted)
    const baseTokenBalanceFormatted = parseFloat(baseTokenBalance.formatted)

    if (isBuySide && quoteTokenBalanceFormatted < formState.total) return
    if (!isBuySide && baseTokenBalanceFormatted < formState.quantity) return

    write({
      args: [formState.price, formState.quantity, baseTokenAddress, quoteTokenAddress],
      from: address,
    })
  }

  return (
    <div className="bg-[#0E111B] w-1/2 min-h-[40%] flex flex-row mt-[5%] border-2 border-solid border-borderColor rounded-2xl">
      <Orderbook
        baseDenom={markets[marketIndex].baseDenom}
        quoteDenom={markets[marketIndex].quoteDenom}
      />
      <div className="w-1/2 px-4 flex flex-col justify-center">
        <MarketDropDown
          markets={markets}
          selectMarket={selectMarketIndex}
        >
          {markets[marketIndex].name}
        </MarketDropDown>
        <NumberInput
          header="Price"
          onChangeFunc={(event) => handleFormChange('price', event.target.value)}
          inputState={formState.inputPrice}
          baseToken={markets[marketIndex].baseDenom}
          quoteToken={markets[marketIndex].quoteDenom}
        />
        <NumberInput
          header="Quantity"
          onChangeFunc={(event) => handleFormChange('quantity', event.target.value)}
          inputState={formState.inputQuantity}
          baseToken={markets[marketIndex].baseDenom}
          quoteToken={markets[marketIndex].quoteDenom}
        />
        <NumberInput
          header="Total"
          onChangeFunc={(event) => handleFormChange('total', event.target.value)}
          inputState={formState.inputTotal}
          baseToken={markets[marketIndex].baseDenom}
          quoteToken={markets[marketIndex].quoteDenom}
        />
        <div className="flex flex-row mt-8 w-full gap-4 font-bold">
          {isBuySide && <button onClick={submitOrder} className="w-3/4 bg-gradient-to-l from-green-400 from-0% to-emerald-600 to-100% p-4 rounded">Buy</button>}
          <button onClick={() => setIsBuySide(!isBuySide)} className={`w-1/4 ${isBuySide ? 'bg-red-500' : 'bg-gradient-to-l from-green-400 from-0% to-emerald-600 to-100%'} rounded`}>
            <img src={ChangeSideIcon} className="block m-auto" />
          </button>
          {!isBuySide && <button className="w-3/4 bg-red-500 p-4 rounded">Sell</button>}
        </div>
      </div>
    </div>
  )
}

export default Order
