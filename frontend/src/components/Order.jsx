import React, { useState } from 'react'

import ChangeSideIcon from '../assets/ChangeSideIcon.svg'
import NumberInput from './NumberInput'

const defaultFormState = {
  price: 0,
  quantity: 0,
  total: 0,
}

function Order() {
  const [formState, setFormState] = useState(defaultFormState)
  const [isBuySide, setIsBuySide] = useState(true)

  const handleFormChange = (key = '', value = '') => {
    const numberValue = Number(value)

    if (!numberValue) return

    switch (key) {
      case 'price':
        setFormState({
          ...formState,
          price: value,
          ...quantity && { total: price * quantity },
        })
        break
      case 'quantity':
        setFormState({
          ...formState,
          quantity: value,
          ...price && { total: price * quantity },
        })
        break
      case 'total':
        setFormState({
          ...formState,
          total: value,
          ...price !== 0 && { quantity: total / price },
        })
        break
      default:
        break
    }
  }

  return (
    <div className="absolute top-1/4 left-1/4 bg-[#1A1D1F] w-1/2 min-h-[40%] flex flex-row py-8 px-16 border-2 border-solid border-[#21273a] rounded-2xl">
      <div className="w-1/2">Orderbook</div>
      <div className="w-1/2 flex flex-col justify-center">
        <h4>Market Name</h4>
        <form>
          <NumberInput
            header="Price"
            onChangeFunc={(event) => handleFormChange('price', event.target.value)}
          />
          <NumberInput
            header="Quantity"
            onChangeFunc={(event) => handleFormChange('quantity', event.target.value)}
          />
          <NumberInput
            header="Total"
            onChangeFunc={(event) => handleFormChange('total', event.target.value)}
          />
          <div className="flex flex-row mt-8 w-full gap-4 font-bold">
            {isBuySide && <button className="w-3/4 bg-gradient-to-l from-green-400 from-0% to-emerald-600 to-100% p-4 rounded">Buy</button>}
            <button onClick={() => setIsBuySide(!isBuySide)} className={`w-1/4 ${isBuySide ? 'bg-red-500' : 'bg-gradient-to-l from-green-400 from-0% to-emerald-600 to-100%'} rounded`}>
              <img src={ChangeSideIcon} className="block m-auto" />
            </button>
            {!isBuySide && <button className="w-3/4 bg-red-500 p-4 rounded">Sell</button>}
          </div>
        </form>
      </div>
    </div>
  )
}

export default Order
