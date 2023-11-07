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
    <div className='relative bg-baseColor w-[150px] p-2 rounded cursor-pointer'>
      <button className="flex flex-row w-full justify-between items-center font-medium text-xl" onClick={() => setOpen(!open)}>
        {children}
        {!open && (<img src={ArrowDown} width="24px" height="24px" />)}
        {open && (<img src={ArrowUp} width="24px" height="24px" />)}
      </button>
      {/* border-2 border-solid border-tertiary divide-y-2 divide-solid divide-tertiary  */}
      {open && (
        <div className="absolute left-0 top-[50px] flex flex-col items-start rounded bg-baseColor w-full p-2 cursor-pointer">
          {markets?.length > 0 && markets.map((market, index) => (
            <div className="text-xl w-full p-4 hover:bg-blue-950 rounded-r-lg border-l-transparent hover:border-l-white border-l-4" key={`market-dropdown-${index}`} onClick={() => handleMarketClick(index)}>{market?.name}</div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MarketDropDown