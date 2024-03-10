import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { MILK_ADDRESSES, NODE_MANAGER } from "src/constants/addresses";
import { setAll } from "src/helpers";
import { multicall } from "src/helpers/multicall";
import { IBaseAddressAsyncThunk } from "src/slices/interfaces";
import { getLevelAndRate, getUserRewardRate } from "src/slices/search-slice";
import { RootState } from "src/store";
import { MilkContract__factory, NftManagerContract__factory } from "src/typechain";
import { getExtraDailyAPRByLevel } from "src/views/NftItem";

interface IUserBalances {
  balances: {
    eth: string;
    milk: string;
  };
}

export const getBalances = createAsyncThunk(
  "account/getBalances",
  async ({ address, networkID, provider }: IBaseAddressAsyncThunk): Promise<IUserBalances> => {
    const cmlContact = new ethers.Contract(
      MILK_ADDRESSES[networkID as keyof typeof MILK_ADDRESSES],
      MilkContract__factory.abi,
      provider,
    );
    const ethBalance = ethers.utils.formatEther(await provider.getBalance(address));
    const milkBalance = ethers.utils.formatUnits(await cmlContact.balanceOf(address), "ether");

    return {
      balances: {
        eth: ethBalance,
        milk: milkBalance,
      },
    };
  },
);

export const loadAccountDetails = createAsyncThunk(
  "account/loadAccountDetails",
  async ({ networkID, provider, address }: IBaseAddressAsyncThunk, { dispatch }) => {
    const nftManagerContract = new ethers.Contract(
      NODE_MANAGER[networkID as keyof typeof NODE_MANAGER],
      NftManagerContract__factory.abi,
      provider,
    );

    const calls_token = [
      {
        address: MILK_ADDRESSES[networkID as keyof typeof MILK_ADDRESSES],
        name: "balanceOf",
        params: [address],
      },
    ];

    const [[milkBalance]] = await multicall(
      MilkContract__factory.abi as any,
      calls_token,
      networkID,
      provider,
    );

    const ethBalance = ethers.utils.formatEther(await provider.getBalance(address));

    const calls_nft1 = [
      {
        address: NODE_MANAGER[networkID as keyof typeof NODE_MANAGER],
        name: "getOwnedNODEIdsOf",
        params: [address],
      },
      {
        address: NODE_MANAGER[networkID as keyof typeof NODE_MANAGER],
        name: "getAvailableNODEIdsOf",
        params: [address],
      },
    ];

    const [[ownedNfts], [supportedNfts]] = await multicall(
      NftManagerContract__factory.abi as any,
      calls_nft1,
      networkID,
      provider,
    );

    const addedNfts = ownedNfts.concat(supportedNfts);
    const duplicate = [];
    for (let i = 0; i < addedNfts.length; i++) {
      for (let j = i + 1; j < addedNfts.length; j++) {
        if (addedNfts[i] * 1 == addedNfts[j] * 1) {
          duplicate.push(j);
        }
      }
    }
    duplicate.sort();
    for (let i = 0; i < duplicate.length; i++) {
      addedNfts.splice(duplicate[duplicate.length - i - 1], 1);
    }

    const nftData = await nftManagerContract.getNFTsByIds(addedNfts);

    const nftCount = nftData.length;

    const nftInfoData = [];
    let totalLockedAmount = 0;
    let totalOwnerReward = 0;
    let totalPendingReward = 0;
    const isOwner = [];

    const calls_nft2 = [];

    for (let i = 0; i < nftCount; i++) {
      calls_nft2.push({
        address: NODE_MANAGER[networkID as keyof typeof NODE_MANAGER],
        name: "ownerOf",
        params: [nftData[i][0]],
      });
    }
    for (let i = 0; i < nftCount; i++) {
      calls_nft2.push({
        address: NODE_MANAGER[networkID as keyof typeof NODE_MANAGER],
        name: "userInfo",
        params: [nftData[i][0], address],
      });
    }
    for (let i = 0; i < nftCount; i++) {
      calls_nft2.push({
        address: NODE_MANAGER[networkID as keyof typeof NODE_MANAGER],
        name: "isOwnerOfNODE",
        params: [address, nftData[i][0]],
      });
    }

    const users = (await multicall(
      NftManagerContract__factory.abi as any,
      calls_nft2,
      networkID,
      provider,
    )) as Array<any>;

    for (let i = 0; i < nftCount; i++) {
      const myInfo = users[1 * nftCount + i];
      const stakedAmount = Number(myInfo.amount) / Math.pow(10, 18);
      const nftStakedAmount = nftData[i % nftCount].amount / Math.pow(10, 18);
      let ownerReward = 0;
      if (users[2 * nftCount + i][0]) {
        ownerReward =
          (nftStakedAmount *
            getExtraDailyAPRByLevel(getLevelAndRate(nftStakedAmount)[0], true) *
            (Date.now() / 1000 - nftData[i % nftCount].lastProcessingTimestamp)) /
          8640000;
      }
      totalOwnerReward += ownerReward + nftData[i % nftCount].lastReward / Math.pow(10, 18);
      totalPendingReward +=
        (stakedAmount * getUserRewardRate(stakedAmount) * (Date.now() / 1000 - myInfo.lastProcessingTimestamp)) /
        100000000000;
      totalLockedAmount += stakedAmount;

      isOwner.push(users[2 * nftCount + i][0]);
    }

    const calls_referral = [
      {
        address: NODE_MANAGER[networkID as keyof typeof NODE_MANAGER],
        name: "getNftReferralsOfUser",
        params: [address],
      },
      {
        address: NODE_MANAGER[networkID as keyof typeof NODE_MANAGER],
        name: "getStakeReferralsOfUser",
        params: [address],
      },
    ];

    const [[nftReferrers], [stakeReferrers]] = await multicall(
      NftManagerContract__factory.abi as any,
      calls_referral,
      networkID,
      provider,
    );

    let totalNftRefAmounts = 0,
      totalMilkRefAmounts = 0;
    const calls_nftRefAmount = [];
    for (let i = 0; i < nftReferrers.length; i++) {
      calls_nftRefAmount.push({
        address: NODE_MANAGER[networkID as keyof typeof NODE_MANAGER],
        name: "nftReferralAmount",
        params: [address, nftReferrers[i]],
      });
    }
    const [nftRefs] = (await multicall(
      NftManagerContract__factory.abi as any,
      calls_nftRefAmount,
      networkID,
      provider,
    )) as Array<any>;

    const calls_milkRefAmount = [];
    for (let i = 0; i < stakeReferrers.length; i++) {
      calls_milkRefAmount.push({
        address: NODE_MANAGER[networkID as keyof typeof NODE_MANAGER],
        name: "stakeReferralAmount",
        params: [address, stakeReferrers[i]],
      });
    }
    const [milkRefs] = (await multicall(
      NftManagerContract__factory.abi as any,
      calls_milkRefAmount,
      networkID,
      provider,
    )) as Array<any>;
    for (let i = 0; i < nftReferrers.length; i++) {
      totalNftRefAmounts += parseInt(nftRefs[i]);
    }
    for (let i = 0; i < stakeReferrers.length; i++) {
      totalMilkRefAmounts += milkRefs[i];
    }

    return {
      balances: {
        eth: ethBalance,
        milk: ethers.utils.formatUnits(milkBalance, "ether"),
      },
      // tag: tag,
      ownedNumber: ownedNfts.length,
      availableNumber: addedNfts.length - ownedNfts.length,
      ownedNfts: ownedNfts,
      stakedNfts: supportedNfts,
      nft: addedNfts,
      isOwner: isOwner,
      totalLockedAmount,
      totalOwnerReward,
      totalPendingReward,
      nftReferrers: nftReferrers,
      stakeReferrers: stakeReferrers,
      totalNftRefAmounts: totalNftRefAmounts / Math.pow(10, 19),
      totalMilkRefAmounts: ethers.utils.formatUnits(totalMilkRefAmounts, "ether"),
      // totalRewardsPerDay: totalRewardsPerDay,
    };
  },
);

export interface INftInfoDetails {
  id: number;
  owner: string;
  lastProcessingTimestamp: number;
  amount: number;
  supportValue: number;
  supporters: IUserInfoDetails[];
  rewardPerDay: number;
  totalPendingReward: number;
  exists: boolean;
  attributes: any[];
}

export interface IUserInfoDetails {
  address: string;
  nftId: number;
  lastProcessingTimestamp: number;
  amount: number;
  // totalPendingReward: number;
  rewardPerDay: number;
}

export interface IAccountSlice extends IUserBalances {
  balances: {
    eth: string;
    milk: string;
  };
  loading: boolean;
  ownedNumber?: number;
  availableNumber?: number;
  ownedNfts: number[];
  stakedNfts: number[];
  nft: number[];
  isOwner?: boolean[];
  totalLockedAmount?: number;
  totalOwnerReward: number;
  totalPendingReward?: number;
  totalRewardsPerDay?: number;
  nftReferrers?: string[];
  stakeReferrers?: string[];
  totalNftRefAmounts?: number;
  totalMilkRefAmounts?: number;
}

const initialState: IAccountSlice = {
  loading: false,
  balances: {
    eth: "",
    milk: "",
  },
  totalOwnerReward: 0,
  nft: [],
  ownedNfts: [],
  stakedNfts: [],
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    fetchAccountSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAccountDetails.pending, state => {
        state.loading = true;
      })
      .addCase(loadAccountDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAccountDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(getBalances.pending, state => {
        state.loading = true;
      })
      .addCase(getBalances.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(getBalances.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      });
  },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: RootState) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);
