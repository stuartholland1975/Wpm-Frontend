import {createAsyncThunk, createEntityAdapter, createSlice,} from "@reduxjs/toolkit";
import axiosInstance from '../../services/axiosApi';


export const fetchWorkInstructions = createAsyncThunk(
    "workInstructions/fetchAll",
    async () => {
        const response = await axiosInstance.get("/wpm/api/orderheader/");
        return response.data;
    }
);

export const updateWorkInstruction = createAsyncThunk(
    "workInstructions/upsertOne",
    async (apiObject) => {
        const response = await axiosInstance.put(
            `/wpm/api/orderheader/${apiObject.id}/`, apiObject
        );
        return response.data;
    }
);

export const newWorkInstruction = createAsyncThunk(
    "workInstructions/addOne",
    async (apiObject) => {
        const response = await axiosInstance.post(
            `/wpm/api/orderheader/`,
            apiObject
        );
        return {...response.data, order_value: 0, item_count: 0};
    }
);

export const resetWorkInstruction = createAsyncThunk(
    "workInstructions/resetOne",
    async (orderId) => {
        const response = await axiosInstance.get(
            `/wpm/api/orderheader/${orderId}/`
        );
        return response.data
    }
);

export const deleteWorkInstruction = createAsyncThunk(
    "workInstructions/deleteOne",
    async (orderId) => {
        const response = await axiosInstance.delete(
            `/wpm/api/orderheader/${orderId}/`
        );
        return orderId
    }
);

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
            resetWorkInstruction.fulfilled,
            workInstructionsAdapter.upsertOne,
        );
        builder.addCase(
            deleteWorkInstruction.fulfilled,
            workInstructionsAdapter.removeOne,
        );
    },
});

export const {removeWorkInstruction} = workInstructionsSlice.actions;

export const {
    selectById: selectWorkInstructionById,
    selectIds: selectWorkInstructionIds,
    selectEntities: selectWorkInstructionEntities,
    selectAll: selectAllWorkInstructions,
    selectTotal: selectTotalWorkInstructions,
} = workInstructionsAdapter.getSelectors((state) => state.workInstructions);
export default workInstructionsSlice.reducer;
