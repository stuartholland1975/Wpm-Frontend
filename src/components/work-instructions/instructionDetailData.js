import {createAsyncThunk, createEntityAdapter, createSlice,} from "@reduxjs/toolkit";
import axiosInstance from '../../services/axiosApi';

export const fetchInstructionDetail = createAsyncThunk(
    "instructionDetail/fetchAll",
    async (orderId) => {
        const response = await axiosInstance.get(`/wpm/api/orderdetail/?work_instruction=${orderId}`);
        return response.data;
    }
);

export const updateInstructionDetail = createAsyncThunk(
    "instructionDetail/upsertOne",
    async (apiObject) => {
        const response = await axiosInstance.put(
            `/wpm/api/orderdetail/${apiObject.id}/`, apiObject
        );
        return response.data;
    }
);

export const newInstructionDetail = createAsyncThunk(
    "instructionDetail/addOne",
    async (apiObject) => {
        const response = await axiosInstance.post(
            `/wpm/api/orderdetail/`,
            apiObject
        );
        return response.data
    }
);

export const deleteInstructionDetail = createAsyncThunk(
    "instructionDetails/deleteOne",
    async (itemId) => {
        const response = await axiosInstance.delete(
            `/wpm/api/siteinstructionDetail/${itemId}/`
        );
        return itemId
    }
);

export const instructionDetailAdapter = createEntityAdapter();

const initialState = instructionDetailAdapter.getInitialState();

export const InstructionDetailSlice = createSlice({
    name: 'instructionDetail',
    initialState,
    reducers: {
        resetInstructionDetails: instructionDetailAdapter.removeAll,
    },
    extraReducers: builder => {
        builder.addCase(
            fetchInstructionDetail.fulfilled,
            instructionDetailAdapter.setAll
        );
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
})

export const {
    selectById: selectInstructionDetailById,
    selectIds: selectInstructionDetailIds,
    selectEntities: selectInstructionDetailEntities,
    selectAll: selectAllInstructionDetails,
    selectTotal: selectTotalInstructionDetails,
} = instructionDetailAdapter.getSelectors((state) => state.instructionDetails);

export const {resetInstructionDetails} = InstructionDetailSlice.actions

export default InstructionDetailSlice.reducer