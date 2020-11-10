import {fetchSupervisors} from "../../services/thunks";
import {createEntityAdapter, createSlice} from "@reduxjs/toolkit";

const supervisorsAdapter = createEntityAdapter()
const initialState = supervisorsAdapter.getInitialState()


export const SupervisorsSlice = createSlice({
	name: "supervisors",
	initialState,
	reducers: {
		removeSupervisors: supervisorsAdapter.removeOne,
		removeAllSupervisorss: supervisorsAdapter.removeAll,
	},
	extraReducers: (builder) => {
		builder.addCase(
			fetchSupervisors.fulfilled,
			supervisorsAdapter.upsertMany
		);
		
	},
});

export const {
	
	selectAll: selectAllSupervisors,
	
} = supervisorsAdapter.getSelectors((state) => state.supervisors);