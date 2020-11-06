import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosApi";

export const fetchLocations = createAsyncThunk(
  "locations/fetchAll",
  async (orderId) => {
    const locations = await axiosInstance.get(
      `/wpm/orders/locations/${orderId}`
    );

    return locations.data;
  }
);
export const updateLocation = createAsyncThunk(
  "locations/upsertOne",
  async (apiObject) => {
    const response = await axiosInstance.put(
      `/wpm/api/sitelocation/${apiObject.id}/`,
      apiObject
    );
    return response.data;
  }
);

export const newLocation = createAsyncThunk(
  "locations/addOne",
  async (apiObject) => {
    const response = await axiosInstance.post(
      `/wpm/api/sitelocation/`,
      apiObject
    );
    return response.data;
  }
);

export const deleteLocation = createAsyncThunk(
  "locations/deleteOne",
  async (locationId) => {
    const response = await axiosInstance.delete(
      `/wpm/api/sitelocation/${locationId}/`
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
    builder.addCase(fetchLocations.fulfilled, locationsAdapter.setAll);
    builder.addCase(updateLocation.fulfilled, locationsAdapter.upsertOne);
    builder.addCase(newLocation.fulfilled, locationsAdapter.addOne);
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

export const { resetLocations, updateImageCount } = LocationsSlice.actions;

export default LocationsSlice.reducer;
