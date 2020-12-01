import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import {
  deleteWorkInstruction,
  fetchWorkInstructions,
  newWorkInstruction,
  updateWorkInstruction,
  fetchAppInstructions,
  fetchAvailableInstructions,
} from "../thunks";

const workInstructionsAdapter = createEntityAdapter();
const availableInstructionsAdapter = createEntityAdapter();

export const workInstructionsSlice = createSlice({
  name: "workInstructions",
  initialState: workInstructionsAdapter.getInitialState(),
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
      workInstructionsAdapter.upsertOne
    );
    builder.addCase(
      deleteWorkInstruction.fulfilled,
      workInstructionsAdapter.removeOne
    );
    builder.addCase(
      fetchAppInstructions.fulfilled,
      workInstructionsAdapter.setAll
    );
  },
});

export const availableInstructionSlice = createSlice({
  name: "availableInstructions",
  initialState: availableInstructionsAdapter.getInitialState(),
  extraReducers: (builders) => {
    builder.addCase(
      fetchAvailableInstructions.fulfilled,
      availableInstructionsAdapter.setAll
    );
  },
});

export const { removeAllWorkInstructions } = workInstructionsSlice.actions;

export const {
  selectById: selectWorkInstructionById,
  selectIds: selectWorkInstructionIds,
  selectEntities: selectWorkInstructionEntities,
  selectAll: selectAllWorkInstructions,
  selectTotal: selectTotalWorkInstructions,
} = workInstructionsAdapter.getSelectors((state) => state.workInstructions);

export const {selectAll: selectAllAvailableWorkInstructions} = availableInstructionsAdapter.getSelectors((state) => state.availableInstructions)
