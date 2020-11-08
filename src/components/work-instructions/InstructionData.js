import {createAsyncThunk, createEntityAdapter, createSlice,} from "@reduxjs/toolkit";
import {fetchWorkInstructions, updateWorkInstruction, newWorkInstruction, deleteWorkInstruction } from "../../services/thunks";
import axiosInstance from '../../services/axiosApi';






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
    },
});

export const {
    selectById: selectWorkInstructionById,
    selectIds: selectWorkInstructionIds,
    selectEntities: selectWorkInstructionEntities,
    selectAll: selectAllWorkInstructions,
    selectTotal: selectTotalWorkInstructions,
} = workInstructionsAdapter.getSelectors((state) => state.workInstructions);
export default workInstructionsSlice.reducer;
