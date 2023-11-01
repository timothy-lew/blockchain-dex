import React, { useState } from 'react'

import ArrowDown from '../assets/ArrowDown.svg'
import ArrowUp from '../assets/ArrowUp.svg'

const MarketDropDown = ({ children, markets, selectMarket }) => {
  const [open, setOpen] = useState(false)

  const handleMarketClick = (marketNum) => {
    if (typeof marketNum !== 'number') {
      console.error('handleMarketClick - marketNum not number')
      return
    }
    selectMarket(marketNum)
    setOpen(false)
    return
  }

  return (
    <div className='relative bg-secondary w-36 p-2 rounded cursor-pointer'>
      <button className="flex flex-row w-full justify-between items-center text-xl" onClick={() => setOpen(!open)}>
        {children}
        {!open && (<img src={ArrowDown} />)}
        {open && (<img src={ArrowUp} />)}
      </button>
      {open && (
        <div className="absolute bg-secondary w-fit p-2 border-2 border-solid border-tertiary divide-y-2 divide-solid divide-tertiary cursor-pointer">
          {markets?.length > 0 && markets.map((market, index) => (
            <div className="text-xl" key={`market-dropdown-${index}`} onClick={() => handleMarketClick(index)}>{market?.name}</div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MarketDropDown