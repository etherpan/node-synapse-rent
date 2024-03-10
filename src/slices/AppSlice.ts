import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { MILK_ADDRESSES, NODE_MANAGER } from "src/constants/addresses";
import { getMarketValue, setAll } from "src/helpers";
import { multicall } from "src/helpers/multicall";
import { IBaseAsyncThunk } from "src/slices/interfaces";
import { RootState } from "src/store";
import { MilkContract__factory, NftManagerContract__factory } from "src/typechain";

export const loadAppDetails = createAsyncThunk(
  "app/loadAppDetails",
  async ({ networkID, provider }: IBaseAsyncThunk, { dispatch }) => {
    const calls_milk = [
      {
        address: MILK_ADDRESSES[networkID as keyof typeof MILK_ADDRESSES],
        name: "totalSupply",
      },
      {
        address: MILK_ADDRESSES[networkID as keyof typeof MILK_ADDRESSES],
        name: "sellFee",
      },
    ];

    const calls_nft = [
      {
        address: NODE_MANAGER[networkID as keyof typeof NODE_MANAGER],
        name: "maxSupply",
      },
      {
        address: NODE_MANAGER[networkID as keyof typeof NODE_MANAGER],
        name: "totalSupply",
      },
      {
        address: NODE_MANAGER[networkID as keyof typeof NODE_MANAGER],
        name: "totalValueLocked",
      },
      {
        address: NODE_MANAGER[networkID as keyof typeof NODE_MANAGER],
        name: "mintPrice",
      },
      {
        address: NODE_MANAGER[networkID as keyof typeof NODE_MANAGER],
        name: "processingFee",
      },
      {
        address: NODE_MANAGER[networkID as keyof typeof NODE_MANAGER],
        name: "totalNftReferralAmount",
      },
      {
        address: NODE_MANAGER[networkID as keyof typeof NODE_MANAGER],
        name: "totalStakeReferralAmount",
      },
    ];

    const marketValue = await getMarketValue(networkID, provider);

    const [[milkTotalSupply], [milkSellFee]] = await multicall(
      MilkContract__factory.abi as any,
      calls_milk,
      networkID,
      provider,
    );

    const [
      [nftTotalSupply],
      [nftMintedSupply],
      [totalValueLocked],
      [mintPrice],
      [processingFee],
      [totalNftReferralAmount],
      [totalStakeReferralAmount],
    ] = await multicall(NftManagerContract__factory.abi as any, calls_nft, networkID, provider);

    return {
      // loading,
      milkPrice: marketValue.price,
      totalLiquidity: marketValue.totalLiquidity,
      milkTotalSupply: ethers.utils.formatUnits(milkTotalSupply, "ether"),
      totalValueLocked: ethers.utils.formatUnits(totalValueLocked, "ether"),
      milkSellFee,
      nftTotalSupply,
      nftMintedSupply,
      stakeMinValue: 0,
      mintPrice: ethers.utils.formatUnits(mintPrice, "ether"),
      processingDelay: 0,
      processingFee,
      totalNftReferralAmount: ethers.utils.formatUnits(totalNftReferralAmount, "ether"),
      totalStakeReferralAmount: ethers.utils.formatUnits(totalStakeReferralAmount, "ether"),
    };
  },
);

/**
 * - fetches the OHM price from CoinGecko (via getTokenPrice)
 * - falls back to fetch marketPrice from ohm-dai contract
 * - updates the App.slice when it runs
 */
const loadMarketPrice = createAsyncThunk("app/loadMarketPrice", async ({ networkID, provider }: IBaseAsyncThunk) => {
  let marketPrice: number;
  try {
    // only get marketPrice
    const marketValue = await getMarketValue(networkID, provider);
    marketPrice = marketValue.price;
  } catch (e) {
    marketPrice = 0.001;
  }
  return { marketPrice };
});

export interface IAppData {
  loading: boolean;
  loadingMarketPrice: boolean;
  milkPrice?: number;
  totalLiquidity?: number;
  milkTotalSupply?: string;
  totalValueLocked?: string;
  milkSellFee?: number;
  nftTotalSupply?: number;
  nftMintedSupply?: number;
  totalNftRewardPerDayFor?: string;
  totalNftRewardClaimed?: string;
  stakeMinValue?: string;
  networkID?: number;
  mintPrice?: number;
  processingDelay?: number;
  processingFee?: number;
  totalNftReferralAmount: number;
  totalStakeReferralAmount: number;
}

const initialState: IAppData = {
  loading: false,
  loadingMarketPrice: false,
  totalNftReferralAmount: 0,
  totalStakeReferralAmount: 0,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    fetchAppSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAppDetails.pending, state => {
        state.loading = true;
      })
      .addCase(loadAppDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAppDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.error(error.name, error.message, error.stack);
      })
      .addCase(loadMarketPrice.pending, state => {
        state.loadingMarketPrice = true;
      })
      .addCase(loadMarketPrice.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loadingMarketPrice = false;
      })
      .addCase(loadMarketPrice.rejected, (state, { error }) => {
        state.loadingMarketPrice = false;
        console.error(error.name, error.message, error.stack);
      });
  },
});

const baseInfo = (state: RootState) => state.app;

export default appSlice.reducer;

export const { fetchAppSuccess } = appSlice.actions;

export const getAppState = createSelector(baseInfo, app => app);
