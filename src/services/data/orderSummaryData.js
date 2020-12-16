import { createSlice } from "@reduxjs/toolkit";

import {
  createLocation,
  deleteLocation,
  fetchOrderSummaryInfo,
  updateLocation,
  newInstructionDetail,
  newDocument,
  newImage,
  updateInstructionDetail,
  updateItemStatus,
  fetchSingleLocation,
} from "../thunks";

const initialState = {
  orderHeader: [],
  orderDetails: [],
  orderLocations: [],
  orderImages: [],
  orderDocuments: [],
};

export const OrderSummaryInfoSlice = createSlice({
  name: "orderSummary",
  initialState: initialState,
  reducers: {
    resetOrderSummaryInfo: (state) => (state = initialState),
  },
  extraReducers: {
    [fetchOrderSummaryInfo.fulfilled]: (state, action) => {
      state.orderHeader = action.payload["OrderHeader"];
      state.orderDetails = action.payload["OrderDetail"];
      state.orderLocations = action.payload["SiteLocation"];
      state.orderImages = action.payload.Image;
      state.orderDocuments = action.payload.Document;
    },

    [createLocation.fulfilled]: (state, action) => {
      state.orderLocations = [...state.orderLocations, action.payload];
    },

    [updateLocation.fulfilled]: (state, action) => {
      state.orderLocations = state.orderLocations.map((item) =>
        item.id !== action.payload.id ? item : action.payload
      );
    },

    [deleteLocation.fulfilled]: (state, action) => {
      state.orderLocations = state.orderLocations.filter(
        (item) => item.id !== action.payload
      );
    },
    [newInstructionDetail.fulfilled]: (state, action) => {
      state.orderDetails = [...state.orderDetails, action.payload];
    },
    [updateInstructionDetail.fulfilled]: (state, action) => {
      state.orderDetails = state.orderDetails.map((item) =>
        item.id !== action.payload.id ? item : action.payload
      );
    },
    [updateItemStatus.fulfilled]: (state, action) => {
      state.orderDetails = state.orderDetails.map((t1) => ({
        ...t1,
        ...action.payload.find((t2) => t2.id === t1.id),
      }));
    },

    [newDocument.fulfilled]: (state, action) => {
      state.orderDocuments = [...state.orderDocuments, action.payload];
    },

    [newImage.fulfilled]: (state, action) => {
      state.orderImages = [...state.orderImages, action.payload];
    },

    [fetchSingleLocation.fulfilled]: (state, action) => {
      state.orderLocations = state.orderLocations.map((item) =>
        item.id !== action.payload.id ? item : action.payload
      );
    },
  },
});

export const { resetOrderSummaryInfo } = OrderSummaryInfoSlice.actions;
