import BigNumber from 'bignumber.js'
import { erc20ABI, useContractWrite } from 'wagmi'

const useApproveERC20ForSpend = (baseTokenAddress, quoteTokenAddress, isBuySide) => {
  try {
    // Type check
    if(typeof baseTokenAddress !== 'string') {
      throw new Error('useApproveERC20ForSpend - baseTokenAddress is not a string')
    }
    if(typeof quoteTokenAddress !== 'string') {
      throw new Error('useApproveERC20ForSpend - quoteTokenAddress is not a string')
    }
    if(typeof isBuySide !== 'boolean') {
      throw new Error('useApproveERC20ForSpend - isBuySide is not a boolean')
    }


    const { data, isLoading, isSuccess, writeAsync } = useContractWrite({
      address: isBuySide ? quoteTokenAddress : baseTokenAddress,
      abi: erc20ABI,
      functionName: 'approve',
    })
  
    const approve = async (approveAmountBN, walletAddress, spenderAddress) => {
      if(!(approveAmountBN instanceof BigNumber)) {
        throw new Error('useApproveERC20ForSpend - approveAmount is not a BigNumber')
      }
      if(typeof walletAddress !== 'string') {
        throw new Error('useApproveERC20ForSpend - walletAddress is not a string')
      }
      if(typeof spenderAddress !== 'string') {
        throw new Error('useApproveERC20ForSpend - spenderAddress is not a string')
      }
      const approveAmount = BigInt(approveAmountBN.toString(10))
      
      console.log ('useApproveERC20ForSpend - Executing Approve')
      const txhash = await writeAsync({
        args:[spenderAddress, approveAmount],
        from: walletAddress,
      })
      console.log(`useApproveERC20ForSpend - approve ${isSuccess} with hash: ${txhash.hash}`)
      console.log(`Gonna excute write to order book after ${txhash.hash}`)
    }
  
    return {
      approveTxHash: data?.hash,
      approveLoading: isLoading,
      approveSuccess: isSuccess,
      approve,
    }
  } catch (error) {
    console.error(error)
  }
}

export default useApproveERC20ForSpend