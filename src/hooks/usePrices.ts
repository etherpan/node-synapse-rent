import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { NetworkId } from "src/constants";
import { OHM_TOKEN } from "src/constants/tokens";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { queryAssertion } from "src/helpers/react-query/queryAssertion";
import { nonNullable } from "src/helpers/types/nonNullable";
import { useCurrentIndex } from "src/hooks/useCurrentIndex";

export const ohmPriceQueryKey = () => ["useOhmPrice"];

/**
 * Returns the market price of OHM.
 */
export const useOhmPrice = () => {
  const key = ohmPriceQueryKey();
  return useQuery<number, Error>([key], async () => {
    const price = await OHM_TOKEN.getPrice(NetworkId.MAINNET);
    return parseFloat(price.toString());
  });
};

export const gohmPriceQueryKey = (marketPrice?: number, currentIndex?: DecimalBigNumber) =>
  ["useGOHMPrice", marketPrice, currentIndex].filter(nonNullable);

/**
 * Returns the calculated price of gOHM.
 */
export const useGohmPrice = () => {
  const { data: ohmPrice } = useOhmPrice();
  const { data: currentIndex } = useCurrentIndex();

  const key = gohmPriceQueryKey(ohmPrice, currentIndex);
  return useQuery<number, Error>(
    [key],
    async () => {
      queryAssertion(ohmPrice && currentIndex, key);

      return currentIndex.toApproxNumber() * ohmPrice;
    },
    { enabled: !!ohmPrice && !!currentIndex },
  );
};

export const EthPrice = () => {
  const [ethPrice, setEthPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchEthPrice = async () => {
    try {
      const response = await axios.get('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD', {
        headers: {
          Authorization: 'Apikey bff1258846ff3b41d2d8932a685ee9613020f83688d873ff50dc148f005f264a'
        }
      });
      const ethPriceData = response.data.USD;
      
      setEthPrice(ethPriceData);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEthPrice();
  }, []);

  return ethPrice;
};