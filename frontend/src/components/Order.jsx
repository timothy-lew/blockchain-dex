import React, { useState } from 'react'

import MarketDropDown from './MarketDropDown'
import NumberInput from './NumberInput'
import Orderbook from './Orderbook'

import ChangeSideIcon from '../assets/ChangeSideIcon.svg'

const defaultFormState = {
  inputPrice: '',
  inputQuantity: '',
  inputTotal: '',
  price: 0,
  quantity: 0,
  total: 0,
}

const markets = ['APA/ETH', 'MEM/ETH']

function Order() {
  const [formState, setFormState] = useState(defaultFormState)
  const [isBuySide, setIsBuySide] = useState(true)
  const [marketIndex, setMarketIndex] = useState(0)

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
    if (marketIndex === 0 || marketIndex === 1) setMarketIndex(marketIndex)
    return
  }

  return (
    <div className="bg-primary w-1/2 min-h-[40%] flex flex-row mt-[5%] border-2 border-solid border-borderColor rounded-2xl">
      <Orderbook market={markets[marketIndex]} />
      <div className="w-1/2 px-4 flex flex-col justify-center">
        <MarketDropDown
          selectMarket={selectMarketIndex}
        >
          {markets[marketIndex]}
        </MarketDropDown>
        <NumberInput
          header="Price"
          onChangeFunc={(event) => handleFormChange('price', event.target.value)}
          inputState={formState.inputPrice}
        />
        <NumberInput
          header="Quantity"
          onChangeFunc={(event) => handleFormChange('quantity', event.target.value)}
          inputState={formState.inputQuantity}
        />
        <NumberInput
          header="Total"
          onChangeFunc={(event) => handleFormChange('total', event.target.value)}
          inputState={formState.inputTotal}
        />
        <div className="flex flex-row mt-8 w-full gap-4 font-bold">
          {isBuySide && <button className="w-3/4 bg-gradient-to-l from-green-400 from-0% to-emerald-600 to-100% p-4 rounded">Buy</button>}
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
