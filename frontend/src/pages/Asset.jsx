import BigNumber from 'bignumber.js'
import React, { useState } from 'react'

const Asset = () => {

  const [tokenName, setTokenName] = useState('')
  const [tokenTicker, setTokenTicker] = useState('')
  const [tokenSupply, setTokenSupply] = useState(undefined)

  const handleFormInputChange = (key, value) => {
    switch (key) {
      case 'tokenName': {
        setTokenName(value)
        break
      }
      case 'tokenTicker': {
        setTokenTicker(value)
        break
      }
      case 'tokenSupply': {
        const valueNum = Number(value ?? 0)
        setTokenSupply(valueNum)
        break
      }
    }
  }

  const submitForm = (event) => {
    event.preventDefault()
    console.log(tokenName, tokenTicker, tokenSupply)

    //Reset Form
    setTokenName('')
    setTokenTicker('')
    setTokenSupply(0)
  }

  return (
    <div className="flex flex-col items-center bg-gradient-to-b from-baseColor from-28% to-baseSecondaryColor to-75% min-h-screen font-body text-textMain">
      <form className="bg-[#0E111B] my-auto border-2 border-solid border-borderColor rounded-2xl p-8">
        <fieldset className="flex flex-col gap-8 text-2xl">
          <legend className="mb-8 text-center">Asset Issuer Form</legend>
          <p>
            <label for="text_1">Token Name:</label>
            <input id="text_1" name="tokenName" type="text" value={tokenName} onChange={(event) => handleFormInputChange('tokenName', event.target.value)} className="block bg-tertiary p-2 rounded text-right focus:outline-none" />
          </p>
          <p>
            <label for="text_2">Token Ticker:</label>
            <input id="text_2" name="tokenTicker" type="text" value={tokenTicker} onChange={(event) => handleFormInputChange('tokenTicker', event.target.value)} className="block bg-tertiary p-2 rounded text-right focus:outline-none" />
          </p>
          <p>
            <label for="text_3">Token Supply:</label>
            <input id="text_3" name="tokenSupply" type="number" value={tokenSupply} onChange={(event) => handleFormInputChange('tokenSupply', event.target.value)} className="block bg-tertiary p-2 rounded text-right focus:outline-none" />
          </p>
          <button type="submit" onClick={(event) => submitForm(event)} className="bg-[#243056] font-bold py-2.5 px-5 text-[#5981F3] hover:text-[#3b4874] rounded-2xl">
            Create Token
          </button>
        </fieldset>
      </form>
    </div>
  )
}

export default Asset