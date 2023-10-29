import React from 'react'

const NumberInput = ({ header, onChangeFunc, inputState }) => {
  return (
    <div className="mt-6">
      <div className='mb-1.5 text-sm text-textSecondary'>{header}</div>
      <input type="number" className="block w-full bg-tertiary p-4 rounded" onChange={onChangeFunc} placeholder='0.00' value={inputState} />
    </div>
  )
}

export default NumberInput