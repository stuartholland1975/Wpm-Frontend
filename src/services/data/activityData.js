import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { fetchActivities, fetchSelectedActivities } from "../thunks";

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
		builder.addCase(
			fetchSelectedActivities.fulfilled,
			activitiesAdapter.setAll
		);
	}
});

export const {selectAll: selectAllActivities} = activitiesAdapter.getSelectors(state => state.activities)

export default ActivitySlice.reducer
