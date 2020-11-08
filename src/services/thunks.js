import { createAsyncThunk, createEntityAdapter, createSlice, } from "@reduxjs/toolkit";
import axiosInstance from "./axiosApi";

export const fetchOrderSummaryInfo = createAsyncThunk(
	"orderSummary/fetchAll",
	async (orderId) => {
		const orderSummary = await axiosInstance.get(
			`/wpm/orders/summary/${ orderId }`
		);

		return orderSummary.data;
	}
);

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


export const deleteWorkInstruction = createAsyncThunk(
    "workInstructions/deleteOne",
    async (orderId) => {
        const response = await axiosInstance.delete(
            `/wpm/api/orderheader/${orderId}/`
        );
        return orderId
    }
);

const instructionHeaderAdapter = createEntityAdapter();
const locationsAdapter = createEntityAdapter();
const itemDetailAdapter = createEntityAdapter()
const imagesAdapter = createEntityAdapter()


export const InstructionHeaderSlice = createSlice({
	name: 'test',
	initialState: instructionHeaderAdapter.getInitialState(),
	extraReducers: builder => {
		builder.addCase(fetchOrderSummaryInfo.fulfilled, ((state, action) => {
		return 	 instructionHeaderAdapter.setAll(state, action.payload.OrderHeader)
		}))
	}
})

export const LocationsSlice = createSlice({
	name: 'test',
	initialState: locationsAdapter.getInitialState(),
	extraReducers: builder => {
		builder.addCase(fetchOrderSummaryInfo.fulfilled, ((state, action) => {
		return 	 locationsAdapter.setAll(state, action.payload.SiteLocation)
		}))
	}
})

export const InstructionDetailDataSlice = createSlice({
	name: 'test',
	initialState: itemDetailAdapter.getInitialState(),
	extraReducers: builder => {
		builder.addCase(fetchOrderSummaryInfo.fulfilled, ((state, action) => {
		return 	 itemDetailAdapter.setAll(state, action.payload.OrderDetail)
		}))
	}
})

export const ImagesSlice = createSlice({
	name: 'test',
	initialState: imagesAdapter.getInitialState(),
	extraReducers: builder => {
		builder.addCase(fetchOrderSummaryInfo.fulfilled, ((state, action) => {
		return 	 imagesAdapter.setAll(state, action.payload.Image)
		}))
	}
})


