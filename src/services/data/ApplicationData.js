import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import {fetchApplications, closeApplication, fetchCurrentApplication, submitApplication} from "../thunks";


const applicationsAdapter = createEntityAdapter();
const initialState = applicationsAdapter.getInitialState();

const ApplicationsSlice = createSlice({
  name: "applications",
  initialState,

  extraReducers: (builder) => {
    builder.addCase(fetchApplications.fulfilled, applicationsAdapter.setAll)
    builder.addCase(closeApplication.fulfilled, applicationsAdapter.setAll)
    builder.addCase(fetchCurrentApplication.fulfilled, applicationsAdapter.upsertOne)
    builder.addCase(submitApplication.fulfilled, applicationsAdapter.upsertOne)
    ;
  },
});

export const {
    selectAll: selectAllApplications
} = applicationsAdapter.getSelectors(state => state.applications)

export default ApplicationsSlice.reducer;
