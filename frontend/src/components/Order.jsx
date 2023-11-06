import BigNumber from 'bignumber.js'
import React, { useState } from 'react'
import { useAccount, useBalance, useContractWrite } from 'wagmi'

import MarketDropDown from './MarketDropDown'
import NumberInput from './NumberInput'
import Orderbook from './Orderbook'

import ChangeSideIcon from '../assets/ChangeSideIcon.svg'
import useApproveERC20ForSpend from '../hooks/useApproveERC20ForSpend'
import { ORDER_CONTRACT_ADDR, ORDER_BOOK_ABI } from '../utils/constants'
import marketsJson from '../utils/markets/markets.json'
import ConnectWalletBtn from './ConnectWalletBtn'

const defaultFormState = {
  inputPrice: '',
  inputQuantity: '',
  inputTotal: '',
  price: 0,
  quantity: 0,
  total: 0,
}

const defaultErrorState = {
  priceError: '',
  quantityError: '',
  totalError: '',
}

const markets = marketsJson.markets

function Order() {
  const [formState, setFormState] = useState(defaultFormState)
  const [isBuySide, setIsBuySide] = useState(true)
  const [marketIndex, setMarketIndex] = useState(0)
  const [errObj, setErrObj] = useState(defaultErrorState)

  const { address, isConnected } = useAccount()

  const { baseTokenAddress, quoteTokenAddress } = markets[marketIndex]
  const { data: baseTokenBalance } = useBalance({ address: address, token: baseTokenAddress === '' ? undefined : baseTokenAddress })
  const { data: quoteTokenBalance } = useBalance({ address: address, token: quoteTokenAddress === '' ? undefined : quoteTokenAddress })

  const { approve, approveLoading } = useApproveERC20ForSpend(markets[marketIndex].baseTokenAddress, markets[marketIndex].quoteTokenAddress, isBuySide)

  const { isLoading: orderLoading, isSuccess: orderSuccess, writeAsync } = useContractWrite({
    address: ORDER_CONTRACT_ADDR,
    abi: ORDER_BOOK_ABI,
    functionName: isBuySide ? 'placeBuyOrder' : 'placeSellOrder',
  })

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
    setMarketIndex(marketIndex)
    setFormState(defaultFormState)
    return
  }

  const submitOrder = async () => {
    // Disabled if wallet not connected
    if (!isConnected) return

    // Clear Error
    const submitOrderErr = {
      priceError: '',
      quantityError: '',
      totalError: '',
    }

    // Error Handling
    if (formState.price === 0) {
      submitOrderErr.priceError = 'Price cannot be 0'
    }

    if (formState.quantity === 0) {
      submitOrderErr.quantityError = 'Quantity cannot be 0'
    }

    const quoteTokenBalanceFormatted = parseFloat(quoteTokenBalance.formatted)
    const baseTokenBalanceFormatted = parseFloat(baseTokenBalance.formatted)

    if (isBuySide && quoteTokenBalanceFormatted < formState.total) {
      submitOrderErr.totalError = `${markets[marketIndex].quoteDenom} balance is insufficient`
    }

    if (!isBuySide && baseTokenBalanceFormatted < formState.quantity && submitOrderErr.quantityError === '') {
      submitOrderErr.quantityError = `${markets[marketIndex].baseDenom} balance insufficient`
    }

    if (submitOrderErr.priceError !== '' || submitOrderErr.quantityError !== '' || submitOrderErr.totalError !== '') {
      setErrObj(submitOrderErr)
      return
    } else {
      setErrObj(defaultErrorState)
    }

    // Shifting to ERC20 token decimal
    const shiftedPrice = BigInt(new BigNumber(formState.price).shiftedBy(18).toString(10))
    const shiftedQuantity = BigInt(new BigNumber(formState.quantity).shiftedBy(18).toString(10))
    const shiftedTotal = BigInt(new BigNumber(formState.total).shiftedBy(18).toString(10))

    // Approve ERC20 token for spending by order contract
    const approveAmount = isBuySide ? shiftedTotal : shiftedQuantity

    await approve(approveAmount, address, ORDER_CONTRACT_ADDR)
    await writeAsync({
      args: [shiftedPrice, shiftedQuantity, baseTokenAddress, quoteTokenAddress],
      from: address,
    })
  }

  return (
    <div className="bg-[#0E111B] w-3/4 min-h-[40%] flex flex-row mt-[5%] border-2 border-solid border-borderColor rounded-2xl">
      <Orderbook
        baseDenom={markets[marketIndex].baseDenom}
        quoteDenom={markets[marketIndex].quoteDenom}
        baseTokenAddress={markets[marketIndex].baseTokenAddress}
        quoteTokenAddress={markets[marketIndex].quoteTokenAddress}
      />
      <div className="w-1/2 px-4 flex flex-col justify-center">
        <MarketDropDown
          markets={markets}
          selectMarket={selectMarketIndex}
        >
          {markets[marketIndex].name}
        </MarketDropDown>
        <NumberInput
          header="Price"
          onChangeFunc={(event) => handleFormChange('price', event.target.value)}
          inputState={formState.inputPrice}
          baseToken={markets[marketIndex].baseDenom}
          quoteToken={markets[marketIndex].quoteDenom}
          errorText={errObj.priceError}
        />
        <NumberInput
          header="Quantity"
          onChangeFunc={(event) => handleFormChange('quantity', event.target.value)}
          inputState={formState.inputQuantity}
          baseToken={markets[marketIndex].baseDenom}
          quoteToken={markets[marketIndex].quoteDenom}
          errorText={errObj.quantityError}
          isBuySide={isBuySide}
        />
        <NumberInput
          header="Total"
          onChangeFunc={(event) => handleFormChange('total', event.target.value)}
          inputState={formState.inputTotal}
          baseToken={markets[marketIndex].baseDenom}
          quoteToken={markets[marketIndex].quoteDenom}
          errorText={errObj.totalError}
        />
        {isConnected && (
          <div className="flex flex-row mt-8 w-full gap-4 font-bold">
            {isBuySide && <button disabled={!isConnected} onClick={submitOrder} className="w-3/4 bg-gradient-to-l from-green-400 from-0% to-emerald-600 to-100% p-4 rounded">Buy</button>}
            <button disabled={!isConnected} onClick={() => setIsBuySide(!isBuySide)} className={`w-1/4 ${isBuySide ? 'bg-red-500' : 'bg-gradient-to-l from-green-400 from-0% to-emerald-600 to-100%'} rounded`}>
              <img src={ChangeSideIcon} className="block m-auto" />
            </button>
            {!isBuySide && <button disabled={!isConnected} onClick={submitOrder} className="w-3/4 bg-red-500 p-4 rounded">Sell</button>}
          </div>
        )}
        {!isConnected && (
          <ConnectWalletBtn classStyle="mt-8 h-14" />
        )}
      </div>
    </div>
  )
}

export default Order
