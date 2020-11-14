import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import {fetchApplications} from "../../services/thunks";


const applicationsAdapter = createEntityAdapter();
const initialState = applicationsAdapter.getInitialState();

const ApplicationsSlice = createSlice({
  name: "applications",
  initialState,

  extraReducers: (builder) => {
    builder.addCase(fetchApplications.fulfilled, applicationsAdapter.setAll);
  },
});

export const {
    selectAll: selectAllApplications
} = applicationsAdapter.getSelectors(state => state.applications)

export default ApplicationsSlice.reducer;
