import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { setAll } from "src/helpers";
import { IBaseAsyncThunk } from "src/slices/interfaces";
import { RootState } from "src/store";

export const galleryAdminDetails = createAsyncThunk(
  "app/galleryAdminDetails",
  async ({ networkID, provider }: IBaseAsyncThunk, { dispatch }) => {
    const response = await fetch(`http://65.21.151.173:3001/node/adminget`);
    const responseJson = await response.json();
    console.log("debug adminresponse", response);
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
  node_no: number;
  seller_address: string;
  node_ip: string;
  node_cpu: string;
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
  name: "galleryAdmin",
  initialState,
  reducers: {
    fetchGallerySuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(galleryAdminDetails.pending, state => {
        state.loading = true;
      })
      .addCase(galleryAdminDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        // state.loading = false;
      })
      .addCase(galleryAdminDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.error(error.name, error.message, error.stack);
      });
  },
});

const baseInfo = (state: RootState) => state.app;

export default gallerySlice.reducer;

export const { fetchGallerySuccess } = gallerySlice.actions;

export const getAppState = createSelector(baseInfo, app => app);
