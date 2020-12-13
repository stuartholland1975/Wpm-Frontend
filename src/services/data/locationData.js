import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import {
  createLocation,
  deleteLocation,
  fetchOrderSummaryInfo,
  updateLocation,
  fetchAppLocations,
  createBulkLocations,
} from "../thunks";

export const locationsAdapter = createEntityAdapter();

export const LocationsSlice = createSlice({
  name: "locations",
  initialState: locationsAdapter.getInitialState({
    loading: false,
  }),
  reducers: {
    resetLocations: locationsAdapter.removeAll,
	updateImageCount: locationsAdapter.updateOne,
	setLoading: (state, action) => {
		state.loading = action.payload
	}
  },
  extraReducers: (builder) => {
    builder.addCase(fetchOrderSummaryInfo.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchOrderSummaryInfo.fulfilled, (state, action) => {
      locationsAdapter.setAll(state, action.payload.SiteLocation);
      state.loading = false;
    });
    builder.addCase(updateLocation.fulfilled, locationsAdapter.upsertOne);
    builder.addCase(createLocation.fulfilled, locationsAdapter.addOne);
    builder.addCase(deleteLocation.fulfilled, locationsAdapter.removeOne);
    builder.addCase(fetchAppLocations.fulfilled, locationsAdapter.setAll);
    builder.addCase(createBulkLocations.fulfilled, locationsAdapter.upsertMany);
  },
});

export const {
  selectById: selectLocationById,
  selectIds: selectLocationIds,
  selectEntities: selectLocationEntities,
  selectAll: selectAllLocations,
  selectTotal: selectTotalLocations,
} = locationsAdapter.getSelectors((state) => state.locations);

export const { resetLocations, setLoading } = LocationsSlice.actions;

export default LocationsSlice.reducer;
