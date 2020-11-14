import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { fetchAvailableWorksheets, updateWorksheet } from "../../services/thunks";


const worksheetAdapter = createEntityAdapter();
const initialState = worksheetAdapter.getInitialState();

const WorksheetSlice = createSlice({
	name: "worksheets",
	initialState,
	reducers: {
		removeWorksheet: worksheetAdapter.removeOne,
		removeAllWorksheets: worksheetAdapter.removeAll,
	},
	extraReducers: builder => {
		builder.addCase(fetchAvailableWorksheets.fulfilled, worksheetAdapter.setAll);
		builder.addCase(updateWorksheet.fulfilled, worksheetAdapter.removeOne)
	}


});

export const {removeAllWorksheets} = WorksheetSlice.actions

export const {selectAll: selectAllAvailableWorksheets} = worksheetAdapter.getSelectors(state => state.worksheets)

export default WorksheetSlice.reducer
