import { createEntityAdapter, createSlice, } from "@reduxjs/toolkit";
import { createLocation, deleteLocation, fetchOrderSummaryInfo, updateLocation, fetchAppLocations } from "../thunks";




export const locationsAdapter = createEntityAdapter();

const initialState = locationsAdapter.getInitialState();

export const LocationsSlice = createSlice({
	name: "locations",
	initialState,
	reducers: {
		resetLocations: locationsAdapter.removeAll,
		updateImageCount: locationsAdapter.updateOne,
	},
	extraReducers: (builder) => {

		builder.addCase(fetchOrderSummaryInfo.fulfilled, ((state, action) => {
			return locationsAdapter.setAll(state, action.payload.SiteLocation);
		}));
		builder.addCase(updateLocation.fulfilled, locationsAdapter.upsertOne);
		builder.addCase(createLocation.fulfilled, locationsAdapter.addOne);
		builder.addCase(deleteLocation.fulfilled, locationsAdapter.removeOne);
		builder.addCase(fetchAppLocations.fulfilled, locationsAdapter.setAll)
	},
});

export const {
	selectById: selectLocationById,
	selectIds: selectLocationIds,
	selectEntities: selectLocationEntities,
	selectAll: selectAllLocations,
	selectTotal: selectTotalLocations,
} = locationsAdapter.getSelectors((state) => state.locations);

export const {resetLocations} = LocationsSlice.actions;

export default LocationsSlice.reducer;