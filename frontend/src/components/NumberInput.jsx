import React from 'react'

const NumberInput = ({ header, onChangeFunc, inputState, baseToken, quoteToken }) => {
  return (
    <div className="mt-6">
      <div className='mb-1.5 text-sm'>{`${header} (${header === 'Quantity' ? baseToken : quoteToken})`}</div>
      <input type="number" className="block w-full bg-tertiary p-4 rounded" onChange={onChangeFunc} placeholder='0' value={inputState} />
    </div>
  )
}

export default NumberInput