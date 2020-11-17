import { createAsyncThunk, createEntityAdapter, createSlice, } from "@reduxjs/toolkit";
import axiosInstance from "../axiosApi";
import { fetchAreas, updateArea } from "../thunks";



export const areasAdapter = createEntityAdapter({
	sortComparer: (a, b) => a["area_code"].localeCompare(b["area_code"]),
});

const initialState = areasAdapter.getInitialState();

const areaSlice = createSlice({
	name: "areas",
	initialState,
	reducers: {
		removeDocument: areasAdapter.removeOne,
	},
	extraReducers: (builder) => {
		builder.addCase(fetchAreas.fulfilled, areasAdapter.upsertMany);
		builder.addCase(updateArea.fulfilled, (state, {payload}) => {
			const {id, ...changes} = payload;
			areasAdapter.updateOne(state, {id, changes});
		});
	},
});

export const {removeArea} = areaSlice.actions;

export const {
	selectById: selectAreaById,
	selectIds: selectAreaIds,
	selectEntities: selectAreaEntities,
	selectAll: selectAllAreas,
	selectTotal: selectTotalAreas,
} = areasAdapter.getSelectors((state) => state.areas);
export default areaSlice.reducer;
