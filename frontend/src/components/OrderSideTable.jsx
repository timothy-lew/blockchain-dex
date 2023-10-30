import { times, uniqueId } from 'lodash'
import React from 'react'

const OrderSideTable = ({ side, rows }) => {
  const numFakeRows = 10 - (rows?.length ?? 0)

  return (
    <div className="w-full h-[40%] scroll-container overflow-auto">
      <table className={`w-full border-r-2 border-borderColor border-solid ${side === 'buy' ? 'text-green-500' : 'text-red-500'}`}>
        <tbody>
          {rows?.map((row) => (
            <tr key={uniqueId('row-')} className='h-5 w-full'>
              <td className="w-1/3 pl-4">{row?.price}</td>
              <td className="w-1/3 pl-4">{row?.quantity}</td>
              <td className="w-1/3 text-center">{row?.price * row?.quantity}</td>
            </tr>
          ))}
          {numFakeRows > 0 && times(numFakeRows, () => (
            <tr key={uniqueId('fake-row-')} className='h-5 w-full'>
              <td className="w-1/3 pl-4">-</td>
              <td className="w-1/3 pl-4">-</td>
              <td className="w-1/3 text-center">-</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default OrderSideTable