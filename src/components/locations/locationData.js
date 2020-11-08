import { createAsyncThunk, createEntityAdapter, createSlice, } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosApi";
import {fetchOrderSummaryInfo} from "../../services/thunks";


export const updateLocation = createAsyncThunk(
	"locations/upsertOne",
	async (apiObject) => {
		const response = await axiosInstance.put(
			`/wpm/api/sitelocation/${ apiObject.id }/`,
			apiObject
		);
		return response.data;
	}
);

export const createLocation = createAsyncThunk(
	"locations/addOne",
	async (apiObject) => {
		const response = await axiosInstance.post(
			`/wpm/api/sitelocation/`,
			apiObject
		);
		const worksheetRef = await {...response.data, worksheet_ref: `${response.data.work_instruction}/${response.data.id}`}
		const responseWithRef = await axiosInstance.patch(`/wpm/api/sitelocation/${ worksheetRef.id }/`,
			worksheetRef)
        const updatedLocation = await axiosInstance.get(`/wpm/api/sitelocation/${ responseWithRef.data.id }`)
		return updatedLocation.data
	}
);

export const deleteLocation = createAsyncThunk(
	"locations/deleteOne",
	async (locationId) => {
		const response = await axiosInstance.delete(
			`/wpm/api/sitelocation/${ locationId }/`
		);
		return locationId;
	}
);

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
		return 	 locationsAdapter.setAll(state, action.payload.SiteLocation)
		}))
		builder.addCase(updateLocation.fulfilled, locationsAdapter.upsertOne);
		builder.addCase(createLocation.fulfilled, locationsAdapter.addOne);
		builder.addCase(deleteLocation.fulfilled, locationsAdapter.removeOne);
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
