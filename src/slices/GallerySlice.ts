import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { setAll } from "src/helpers";
import { IBaseAsyncThunk } from "src/slices/interfaces";
import { RootState } from "src/store";

export const galleryDetails = createAsyncThunk(
  "app/galleryDetails",
  async ({ networkID, provider }: IBaseAsyncThunk, { dispatch }) => {
    // const calls_nft_supply = [
    //   {
    //     address: NODE_MANAGER[networkID as keyof typeof NODE_MANAGER],
    //     name: "totalSupply",
    //   },
    // ];

    // const [[nftMintedSupply]] = await multicall(
    //   NftManagerContract__factory.abi as any,
    //   calls_nft_supply,
    //   networkID,
    //   provider,
    // );

    // const nfts = [];
    // const calls_nft = [];
    // const ids = Array.from({ length: nftMintedSupply }, (_, i) => i + 1);
    // calls_nft.push(
    //   {
    //     address: NODE_MANAGER[networkID as keyof typeof NODE_MANAGER],
    //     name: "getNFTsByIds",
    //     params: [ids],
    //   },
    //   {
    //     address: NODE_MANAGER[networkID as keyof typeof NODE_MANAGER],
    //     name: "getUsersOf",
    //     params: [ids],
    //   },
    // );
    // for (let i = 0; i < parseInt(nftMintedSupply); i++) {
    //   const id = i + 1;
    //   calls_nft.push(
    //     // {
    //     //   address: NODE_MANAGER[networkID as keyof typeof NODE_MANAGER],
    //     //   name: "getNFTsByIds",
    //     //   params: [[id]],
    //     // },
    //     // {
    //     //   address: NODE_MANAGER[networkID as keyof typeof NODE_MANAGER],
    //     //   name: "getUsersOf",
    //     //   params: [[id]],
    //     // },
    //     {
    //       address: NODE_MANAGER[networkID as keyof typeof NODE_MANAGER],
    //       name: "ownerOf",
    //       params: [id],
    //     },
    //   );
    // }

    // const nftData = (await multicall(
    //   NftManagerContract__factory.abi as any,
    //   calls_nft,
    //   networkID,
    //   provider,
    // )) as Array<any>;

    // for (let i = 0; i < nftMintedSupply; i++) {
    //   const id = i + 1;
    //   const nft = {
    //     id: id,
    //     owner: nftData[i + 2][0].toString(),
    //     level: getLevelAndRate(parseInt(ethers.utils.formatUnits(nftData[0][0][i].amount, "ether")))[0],
    //     totalStakedAmount: parseFloat(ethers.utils.formatUnits(nftData[0][0][i].amount, "ether")),
    //     totalStakers: parseInt(nftData[1][0][i].length),
    //     nftLastProcessingTimestamp: parseInt(nftData[0][0][i].lastProcessingTimestamp),
    //     nftLastReward: parseFloat(ethers.utils.formatUnits(nftData[0][0][i].lastReward, "ether")),
    //   };
    //   nfts.push(nft);
    // }
    // return {
    //   loading: false,
    //   nfts,
    // } as IGalleryData;
    const response = await fetch(`http://localhost:3001/node/get`);
    const responseJson = await response.json();
    console.log("response", responseJson.items);
    return responseJson.items;
  },
);

export interface IGalleryData {
  loading: boolean;
  items: INodeItem[];
}

export interface INodeItem {
  node_no: number;
  user_address: string;
  node_ip: string;
  node_gpu: string;
  gpu_capacity: number;
  cpu_capacity: number;
  node_download: any;
  node_upload: any;
  node_usage: any;
  node_price: number;
  node_privateKey: string;
  approve: number;
}

const initialState: IGalleryData = {
  loading: true,
  items: [],
};

const gallerySlice = createSlice({
  name: "gallery",
  initialState,
  reducers: {
    fetchGallerySuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(galleryDetails.pending, state => {
        state.loading = true;
      })
      .addCase(galleryDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        // state.loading = false;
      })
      .addCase(galleryDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.error(error.name, error.message, error.stack);
      });
  },
});

const baseInfo = (state: RootState) => state.app;

export default gallerySlice.reducer;

export const { fetchGallerySuccess } = gallerySlice.actions;

export const getAppState = createSelector(baseInfo, app => app);
