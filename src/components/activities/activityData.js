import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { fetchActivities } from "../../services/thunks";

const activitiesAdapter = createEntityAdapter();
const initialState = activitiesAdapter.getInitialState();

const ActivitySlice = createSlice({
	name: "activities",
	initialState,
	extraReducers: builder => {
		builder.addCase(
			fetchActivities.fulfilled,
			activitiesAdapter.setAll
		);
	}
});

export const {selectAll: selectAllActivities} = activitiesAdapter.getSelectors(state => state.activities)

export default ActivitySlice.reducer
