import { useEffect, useState } from 'react'
import { useContractRead } from 'wagmi'

import { TOKEN_FACTORY_ABI, TOKEN_FACTORY_ADDR } from '../utils/constants'
import marketsJson from '../utils/markets/markets.json'
import { defaultTokens } from '../utils/tokens'

const initialMarkets = marketsJson.markets

const useGetMarkets = () => {
  const [markets, setMarkets] = useState(initialMarkets)
  const { data } = useContractRead({
    address: TOKEN_FACTORY_ADDR,
    abi: TOKEN_FACTORY_ABI,
    functionName: 'getAllTokenInfo',
  })

  useEffect(() => {
    const quoteDenomArr = markets.map((market) => {
      return market.quoteDenom
    })
    const noMarketTokens = data?.filter((tokenObj) => {
      if (!quoteDenomArr.includes(tokenObj?.ticker)) return true
      return false
    })
    const tempNewMarkets = []
    noMarketTokens?.forEach(tokenObj => {
      tempNewMarkets.push(
        {
        name: `${defaultTokens[0].ticker}/${tokenObj?.ticker}`,
        baseDenom: defaultTokens[0].ticker,
        quoteDenom: tokenObj?.ticker,
        baseTokenAddress: defaultTokens[0].tokenAddress,
        quoteTokenAddress: tokenObj?.tokenAddress,
        },
        {
          name: `${defaultTokens[1].ticker}/${tokenObj?.ticker}`,
          baseDenom: defaultTokens[1].ticker,
          quoteDenom: tokenObj?.ticker,
          baseTokenAddress: defaultTokens[1].tokenAddress,
          quoteTokenAddress: tokenObj?.tokenAddress,
        },
        {
          name: `${defaultTokens[2].ticker}/${tokenObj?.ticker}`,
          baseDenom: defaultTokens[2].ticker,
          quoteDenom: tokenObj?.ticker,
          baseTokenAddress: defaultTokens[2].tokenAddress,
          quoteTokenAddress: tokenObj?.tokenAddress,
        },
      )
    })
    
    if (tempNewMarkets.length > 0) {
      const newMarketState = markets.concat(tempNewMarkets)
      setMarkets(newMarketState)
    }
  }, [data])
  return markets
}

export default useGetMarkets