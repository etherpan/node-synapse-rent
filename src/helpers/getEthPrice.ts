import { JsonRpcProvider } from "@ethersproject/providers";
import axios from "axios";
import { useEffect, useState } from "react";

const GAS = "5";

export const useEthPrice = () => {
  const [ethPrice, setEthPrice] = useState<number>(0);

  useEffect(() => {
    const fetchEthPrice = async () => {
      try {
        const response = await axios.get("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD", {
          headers: {
            Authorization: "Apikey bff1258846ff3b41d2d8932a685ee9613020f83688d873ff50dc148f005f264a",
          },
        });
        const ethPriceData = response.data.USD;

        setEthPrice(ethPriceData);
      } catch (error) {
        console.error("Error fetching ETH price:", error);
      }
    };

    fetchEthPrice();

    // Cleanup function if needed
    // This is just a dummy example, you might not need cleanup here
    // If you do, make sure to return a cleanup function
  }, []);

  return ethPrice;
};
