import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { fetchAvailableWorksheets, addWorksheetToApplication, fetchRecentWorksheets, fetchWeeklyWorksheets } from "../thunks";


const availableWorksheetAdapter = createEntityAdapter();

export const AvailableWorksheetSlice = createSlice({
	name: "availableWorksheets",
	initialState: availableWorksheetAdapter.getInitialState(),
	reducers: {
		removeWorksheet: availableWorksheetAdapter.removeOne,
		removeAllWorksheets: availableWorksheetAdapter.removeAll,
	},
	extraReducers: builder => {
		builder.addCase(fetchAvailableWorksheets.fulfilled, availableWorksheetAdapter.setAll);
		builder.addCase(addWorksheetToApplication.fulfilled, availableWorksheetAdapter.removeOne)
		
	}
});

const recentWorksheetAdapter = createEntityAdapter();

export const RecentWorksheetSlice = createSlice({
	name: "recentWorksheets",
	initialState: recentWorksheetAdapter.getInitialState(),
	reducers: {
		removeWorksheet: recentWorksheetAdapter.removeOne,
		removeAllRecentWorksheets: recentWorksheetAdapter.removeAll,
	},
	extraReducers: builder => {
		builder.addCase(fetchRecentWorksheets.fulfilled, recentWorksheetAdapter.setAll);
		builder.addCase(fetchWeeklyWorksheets.fulfilled, availableWorksheetAdapter.setAll)
	}
});

export const {removeAllWorksheets} = AvailableWorksheetSlice.actions
export const {removeAllRecentWorksheets} = RecentWorksheetSlice.actions

export const {selectAll: selectAllAvailableWorksheets} = availableWorksheetAdapter.getSelectors(state => state.worksheetsAvailable)
export const {selectAll: selectAllRecentWorksheets} = recentWorksheetAdapter.getSelectors(state => state.worksheetsRecent)

//export default WorksheetSlice.reducer
