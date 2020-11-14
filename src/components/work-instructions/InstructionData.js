import { createEntityAdapter, createSlice, } from "@reduxjs/toolkit";
import {
    deleteWorkInstruction,
    fetchWorkInstructions,
    newWorkInstruction,
	updateWorkInstruction,
	fetchAppInstructions
} from "../../services/thunks";


export const workInstructionsAdapter = createEntityAdapter();

const initialState = workInstructionsAdapter.getInitialState();

export const workInstructionsSlice = createSlice({
	name: "workInstructions",
	initialState,
	reducers: {
		removeWorkInstruction: workInstructionsAdapter.removeOne,
		removeAllWorkInstructions: workInstructionsAdapter.removeAll,
	},
	extraReducers: (builder) => {
		builder.addCase(
			fetchWorkInstructions.fulfilled,
			workInstructionsAdapter.upsertMany
		);
		builder.addCase(
			newWorkInstruction.fulfilled,
			workInstructionsAdapter.upsertOne
		);
		builder.addCase(
			updateWorkInstruction.fulfilled,
			workInstructionsAdapter.upsertOne,
		);
		builder.addCase(
			deleteWorkInstruction.fulfilled,
			workInstructionsAdapter.removeOne,
		);
		builder.addCase(
			fetchAppInstructions.fulfilled,
			workInstructionsAdapter.setAll,
		);
	},
});

export const {removeAllWorkInstructions} = workInstructionsSlice.actions

export const {
	selectById: selectWorkInstructionById,
	selectIds: selectWorkInstructionIds,
	selectEntities: selectWorkInstructionEntities,
	selectAll: selectAllWorkInstructions,
	selectTotal: selectTotalWorkInstructions,
} = workInstructionsAdapter.getSelectors((state) => state.workInstructions);
export default workInstructionsSlice.reducer;
