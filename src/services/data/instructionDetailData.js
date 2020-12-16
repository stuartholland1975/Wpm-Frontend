import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axiosInstance from "../axiosApi";
import {
  deleteInstructionDetail,
  fetchOrderSummaryInfo,
  newInstructionDetail,
  updateInstructionDetail,
  fetchAppItems,
  fetchAppInstructions,
  createBulkBillItems,
  updateItemStatus,
} from "../thunks";

export const instructionDetailAdapter = createEntityAdapter();

const initialState = instructionDetailAdapter.getInitialState();

export const InstructionDetailSlice = createSlice({
  name: "instructionDetail",
  initialState,
  reducers: {
    resetInstructionDetails: instructionDetailAdapter.removeAll,
    updateGridOrderItem: instructionDetailAdapter.upsertOne,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchOrderSummaryInfo.fulfilled, (state, action) => {
      return instructionDetailAdapter.setAll(state, action.payload.OrderDetail);
    });
    builder.addCase(
      updateInstructionDetail.fulfilled,
      instructionDetailAdapter.upsertOne
    );
    builder.addCase(
      newInstructionDetail.fulfilled,
      instructionDetailAdapter.addOne
    );
    builder.addCase(
      deleteInstructionDetail.fulfilled,
      instructionDetailAdapter.removeOne
    );
    builder.addCase(fetchAppItems.fulfilled, instructionDetailAdapter.setAll);
    builder.addCase(
      createBulkBillItems.fulfilled,
      instructionDetailAdapter.upsertMany
    );
    builder.addCase(
      updateItemStatus.fulfilled,
      instructionDetailAdapter.upsertMany
    );
  },
});

export const {
  selectById: selectInstructionDetailById,
  selectIds: selectInstructionDetailIds,
  selectEntities: selectInstructionDetailEntities,
  selectAll: selectAllInstructionDetails,
  selectTotal: selectTotalInstructionDetails,
} = instructionDetailAdapter.getSelectors((state) => state.instructionDetails);

export const {
  resetInstructionDetails,
  updateGridOrderItem,
} = InstructionDetailSlice.actions;

export default InstructionDetailSlice.reducer;
