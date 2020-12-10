import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import {
  fetchAvailableWorksheets,
  addWorksheetToApplication,
  fetchRecentWorksheets,
  fetchWeeklyWorksheets,
  addBulkWorksheetToApplication,
} from "../thunks";

const availableWorksheetAdapter = createEntityAdapter();

export const AvailableWorksheetSlice = createSlice({
  name: "availableWorksheets",
  initialState: availableWorksheetAdapter.getInitialState(),
  reducers: {
    removeWorksheet: availableWorksheetAdapter.removeOne,
    removeAllWorksheets: availableWorksheetAdapter.removeAll,
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchAvailableWorksheets.fulfilled,
      availableWorksheetAdapter.setAll
    );
    builder.addCase(
      addWorksheetToApplication.fulfilled,
      availableWorksheetAdapter.removeOne
    );
    builder.addCase(
      addBulkWorksheetToApplication.fulfilled,
      availableWorksheetAdapter.removeMany
    );
  },
});

const recentWorksheetAdapter = createEntityAdapter();

export const RecentWorksheetSlice = createSlice({
  name: "recentWorksheets",
  initialState: recentWorksheetAdapter.getInitialState({
    loading: false,
  }),
  reducers: {
    removeWorksheet: recentWorksheetAdapter.removeOne,
    removeAllRecentWorksheets: recentWorksheetAdapter.removeAll,
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchRecentWorksheets.fulfilled,
      recentWorksheetAdapter.setAll
    );
    builder.addCase(fetchWeeklyWorksheets.fulfilled, (state, action) => {
      recentWorksheetAdapter.setAll(state, action.payload);
      state.loading = false;
    });
    builder.addCase(fetchWeeklyWorksheets.pending, (state) => {
      state.loading = true;
    });
  },
});

export const { removeAllWorksheets } = AvailableWorksheetSlice.actions;
export const { removeAllRecentWorksheets } = RecentWorksheetSlice.actions;

export const {
  selectAll: selectAllAvailableWorksheets,
} = availableWorksheetAdapter.getSelectors(
  (state) => state.worksheetsAvailable
);
export const {
  selectAll: selectAllRecentWorksheets,
} = recentWorksheetAdapter.getSelectors((state) => state.worksheetsRecent);

//export default WorksheetSlice.reducer
