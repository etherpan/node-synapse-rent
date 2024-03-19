import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { BASEURL } from "src/constants";
import { setAll } from "src/helpers";
import { IBaseAsyncThunk } from "src/slices/interfaces";
import { RootState } from "src/store";

export const galleryPurchaseDetails = createAsyncThunk(
  "app/galleryPurchaseDetails",
  async () => {
    const response = await fetch(`${BASEURL}/node/adminpurchase`);
    const responseJson = await response.json();
    return {
      loading: false,
      items: responseJson.items,
    } as IGalleryData;
  },
);

export interface IGalleryData {
  loading: boolean;
  items: INodeItem[];
}

export interface INodeItem {
  ssh_username(ssh_username: any): import("react").ReactNode;
  buyer_info: string;
  buyer_address:string;
  seller_info: string;
  purchase_tx: string;
  purchase: any;
  purchase_date: string | number | Date;
  node_name: string;
  node_createDate: string;
  node_no: number;
  seller_address: string;
  node_cpu: string;
  node_gpu: string;
  gpu_capacity: number;
  cpu_capacity: number;
  node_download: any;
  node_upload: any;
  node_usage: any;
  node_price: number;
  approve: number;
  status: number;
  ssh_hostname: "";
  node_ip: "";
  ssh_key: "";
}

const initialState: IGalleryData = {
  loading: true,
  items: [],
};

const gallerySlice = createSlice({
  name: "galleryAdmin",
  initialState,
  reducers: {
    fetchGallerySuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(galleryPurchaseDetails.pending, state => {
        state.loading = true;
      })
      .addCase(galleryPurchaseDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        // state.loading = false;
      })
      .addCase(galleryPurchaseDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.error(error.name, error.message, error.stack);
      });
  },
});

const baseInfo = (state: RootState) => state.app;

export default gallerySlice.reducer;

export const { fetchGallerySuccess } = gallerySlice.actions;

export const getAppState = createSelector(baseInfo, app => app);
