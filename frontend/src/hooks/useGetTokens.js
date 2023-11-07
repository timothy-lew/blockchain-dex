import { useContractRead } from 'wagmi'
import { TOKEN_FACTORY_ABI, TOKEN_FACTORY_ADDR } from '../utils/constants'

const useGetTokens = () => {
  const { data } = useContractRead({
    address: TOKEN_FACTORY_ADDR,
    abi: TOKEN_FACTORY_ABI,
    functionName: 'getTokens',
  })

  

  // Write to markets.json or tokens.json
}

export default useGetTokens