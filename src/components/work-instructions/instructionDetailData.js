import { createAsyncThunk, createEntityAdapter, createSlice, } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosApi";
import {
	deleteInstructionDetail,
	fetchOrderSummaryInfo,
	newInstructionDetail,
	updateInstructionDetail
} from "../../services/thunks";




export const instructionDetailAdapter = createEntityAdapter();

const initialState = instructionDetailAdapter.getInitialState();

export const InstructionDetailSlice = createSlice({
	name: "instructionDetail",
	initialState,
	reducers: {
		resetInstructionDetails: instructionDetailAdapter.removeAll,
		updateGridOrderItem: instructionDetailAdapter.upsertOne,
	},
	extraReducers: builder => {
		builder.addCase(fetchOrderSummaryInfo.fulfilled, ((state, action) => {
			return instructionDetailAdapter.setAll(state, action.payload.OrderDetail);
		}));
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
	},
});

export const {
	selectById: selectInstructionDetailById,
	selectIds: selectInstructionDetailIds,
	selectEntities: selectInstructionDetailEntities,
	selectAll: selectAllInstructionDetails,
	selectTotal: selectTotalInstructionDetails,
} = instructionDetailAdapter.getSelectors((state) => state.instructionDetails);

export const {resetInstructionDetails, updateGridOrderItem} = InstructionDetailSlice.actions;

export default InstructionDetailSlice.reducer;
