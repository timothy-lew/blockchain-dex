import React from 'react'

const ActiveOrder = ({ rows }) => {
  return (
    <div className="w-1/2 mt-5 text-center">
      Active Orders
      <div className="relative bg-primary h-72 border-2 border-solid border-borderColor rounded-2xl">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-solid border-borderColor divide-x-2 divide-borderColor">
              <td className="w-1/4 text-center py-2">Market</td>
              <td className="w-1/4 text-center py-2">Price</td>
              <td className="w-1/4 text-center py-2">Quantity</td>
              <td className="w-1/4 text-center py-2">Total</td>
            </tr>
          </thead>
          <tbody>
            {rows?.length > 0 && rows.map((row) => (
              <tr>
                <td className="w-1/4 text-center py-2">{`${row?.baseToken}/${row?.quoteToken}`}</td>
                <td className="w-1/4 text-center py-2">{row?.price}</td>
                <td className="w-1/4 text-center py-2">{row?.quantity}</td>
                <td className="w-1/4 text-center py-2">{row?.price * row?.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows?.length && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">No Active Orders</div>
        )}
      </div>
    </div>
  )
}

export default ActiveOrder