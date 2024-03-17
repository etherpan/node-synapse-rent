import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "src/slices/AccountSlice";
import appReducer from "src/slices/AppSlice";
import galleryReducer from "src/slices/GallerySlice";
import adminGalleryReducer from "src/slices/GalleryAdminSlice";
import accountGalleryReducer from "src/slices/GalleryAddressSlice";
import adminPurchaseReducer from "src/slices/PurchaseAdminSlice";
import pendingTransactionsReducer from "src/slices/PendingTxnsSlice";
// reducers are named automatically based on the name field in the slice
// exported in slice files by default as nameOfSlice.reducer

const store = configureStore({
  reducer: {
    account: accountReducer,
    app: appReducer,
    gallery: galleryReducer,
    adminGallery: adminGalleryReducer,
    accountGallery: accountGalleryReducer,
    adminPurchaseHistory: adminPurchaseReducer,
    pendingTransactions: pendingTransactionsReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
