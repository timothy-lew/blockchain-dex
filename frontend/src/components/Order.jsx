import React, { useState } from 'react'
import { useAccount, useBalance, useContractWrite, usePrepareContractWrite, useWebSocketPublicClient } from 'wagmi'

import MarketDropDown from './MarketDropDown'
import NumberInput from './NumberInput'
import Orderbook from './Orderbook'

import ChangeSideIcon from '../assets/ChangeSideIcon.svg'
import { apaTokenAddress, memTokenAddress } from '../utils/tokens'
import { orderbookABI } from '../utils/abis'

const defaultFormState = {
  inputPrice: '',
  inputQuantity: '',
  inputTotal: '',
  price: 0,
  quantity: 0,
  total: 0,
}

const markets = ['APA/ETH', 'MEM/ETH', 'APA/MEM']

function Order() {
  const [formState, setFormState] = useState(defaultFormState)
  const [isBuySide, setIsBuySide] = useState(true)
  const [marketIndex, setMarketIndex] = useState(0)

  const { address, isConnected } = useAccount()

  const getTokenAddresses = (market) => {
    // returns [baseTokenAddr, quoteTokenAddr]
    switch (market) {
      case 'APA/ETH': {
        return [apaTokenAddress, ''] // need add eth token address
      }
      case 'MEM/ETH': {
        return [memTokenAddress, ''] // need add eth token address
      }
      case 'APA/MEM': {
        return [apaTokenAddress, memTokenAddress]
      }
      default:
        break
    }
  }

  const [baseTokenAddress, quoteTokenAddress] = getTokenAddresses(markets[marketIndex])
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
    if (marketIndex === 0 || marketIndex === 1 || marketIndex === 2) setMarketIndex(marketIndex)
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
      <Orderbook market={markets[marketIndex]} />
      <div className="w-1/2 px-4 flex flex-col justify-center">
        <div className="flex flex-row">
          <MarketDropDown
            selectMarket={selectMarketIndex}
          >
            {markets[marketIndex]}
          </MarketDropDown>
          <div className='ml-4 border-2 border-red-500 p-4'>{isLoading ? 'Loading' : data}</div>
        </div>
        <NumberInput
          header="Price"
          onChangeFunc={(event) => handleFormChange('price', event.target.value)}
          inputState={formState.inputPrice}
          baseToken={markets[marketIndex].split('/')[0]}
          quoteToken={markets[marketIndex].split('/')[1]}
        />
        <NumberInput
          header="Quantity"
          onChangeFunc={(event) => handleFormChange('quantity', event.target.value)}
          inputState={formState.inputQuantity}
          baseToken={markets[marketIndex].split('/')[0]}
          quoteToken={markets[marketIndex].split('/')[1]}
        />
        <NumberInput
          header="Total"
          onChangeFunc={(event) => handleFormChange('total', event.target.value)}
          inputState={formState.inputTotal}
          baseToken={markets[marketIndex].split('/')[0]}
          quoteToken={markets[marketIndex].split('/')[1]}
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
