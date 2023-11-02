import BigNumber from 'bignumber.js'
import { times, uniqueId } from 'lodash'
import React from 'react'

const OrderSideTable = ({ side, rows }) => {
  const numFakeRows = 10 - (rows?.length ?? 0)

  return (
    <div className="w-full h-[40%] scroll-container overflow-auto">
      <table className={`w-full border-r-2 border-borderColor border-solid ${side === 'buy' ? 'text-green-500' : 'text-red-500'}`}>
        <tbody>
          {rows?.map((row) => {
            const unshiftedPrice = new BigNumber(row?.price)
            const unshiftedQuantity = new BigNumber(row?.quantity)
            const unshiftedTotal = unshiftedPrice.times(unshiftedQuantity)
            const formattedPrice = unshiftedPrice.shiftedBy(-18).toString(10)
            const formattedQuantity = unshiftedQuantity.shiftedBy(-18).toString(10)
            const formattedTotal = unshiftedTotal.shiftedBy(-18).toString(10)
            return (
              <tr key={uniqueId('row-')} className='h-5 w-full'>
                <td className="w-1/3 pl-4">{side === 'buy' ? formattedPrice : unshiftedPrice.toString(10)}</td>
                <td className="w-1/3 pl-4">{side === 'buy' ? unshiftedQuantity.toString(10) : formattedQuantity}</td>
                <td className="w-1/3 text-center">{formattedTotal}</td>
              </tr>
            )
          })}
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