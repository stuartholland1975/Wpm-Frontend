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

export const fetchSupervisors = createAsyncThunk(
	"supervisors/fetchAll",
	async () => {
		const supervisors = await axiosInstance.get(
			`/wpm/api/supervisors/`
		);

		return supervisors.data;
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
			`/wpm/api/orderheader/${ apiObject.id }/`, apiObject
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
			`/wpm/api/orderheader/${ orderId }/`
		);
		return orderId;
	}
);

export const updateInstructionDetail = createAsyncThunk(
	"instructionDetail/upsertOne",
	async (apiObject) => {
		const response = await axiosInstance.put(
			`/wpm/api/orderdetail/${ apiObject.id }/`, apiObject
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
		return response.data;
	}
);

export const deleteInstructionDetail = createAsyncThunk(
	"instructionDetails/deleteOne",
	async (itemId) => {
		const response = await axiosInstance.delete(
			`/wpm/api/siteinstructionDetail/${ itemId }/`
		);
		return itemId;
	}
);

export const fetchAreas = createAsyncThunk("areas/fetchAll", async () => {
	const response = await axiosInstance.get("/wpm/api/areas/");
	return response.data;
});

export const updateArea = createAsyncThunk("area/updateOne", async (arg) => {
	const response = await axiosInstance.put(`/wpm/api/areas/${ arg }`);
	return response.data;
});

export const fetchDocuments = createAsyncThunk(
	"documents/fetchAll",
	async () => {
		const response = await axiosInstance.get("/wpm/api/documents/");
		return response.data;
	}
);

export const updateDocument = createAsyncThunk(
	"documents/updateOne",
	async (arg) => {
		const response = await axiosInstance.get(`/wpm/api/documents/${ arg }`);
		return response.data;
	}
);

export const updateLocation = createAsyncThunk(
	"locations/upsertOne",
	async (apiObject) => {
		const response = await axiosInstance.put(
			`/wpm/api/sitelocation/${ apiObject.id }/`,
			apiObject
		);
		return response.data;
	}
);

export const createLocation = createAsyncThunk(
	"locations/addOne",
	async (apiObject) => {
		const response = await axiosInstance.post(
			`/wpm/api/sitelocation/`,
			apiObject
		);
		const worksheetRef = await {
			...response.data,
			worksheet_ref: `${ response.data.work_instruction }/${ response.data.id }`
		};
		const responseWithRef = await axiosInstance.patch(`/wpm/api/sitelocation/${ worksheetRef.id }/`,
			worksheetRef);
		const updatedLocation = await axiosInstance.get(`/wpm/api/sitelocation/${ responseWithRef.data.id }`);
		return updatedLocation.data;
	}
);

export const deleteLocation = createAsyncThunk(
	"locations/deleteOne",
	async (locationId) => {
		const response = await axiosInstance.delete(
			`/wpm/api/sitelocation/${ locationId }/`
		);
		return locationId;
	}
);

const instructionHeaderAdapter = createEntityAdapter();
const locationsAdapter = createEntityAdapter();
const itemDetailAdapter = createEntityAdapter();
const imagesAdapter = createEntityAdapter();


export const InstructionHeaderSlice = createSlice({
	name: "test",
	initialState: instructionHeaderAdapter.getInitialState(),
	extraReducers: builder => {
		builder.addCase(fetchOrderSummaryInfo.fulfilled, ((state, action) => {
			return instructionHeaderAdapter.setAll(state, action.payload.OrderHeader);
		}));
	}
});

export const LocationsSlice = createSlice({
	name: "test",
	initialState: locationsAdapter.getInitialState(),
	extraReducers: builder => {
		builder.addCase(fetchOrderSummaryInfo.fulfilled, ((state, action) => {
			return locationsAdapter.setAll(state, action.payload.SiteLocation);
		}));
	}
});

export const InstructionDetailDataSlice = createSlice({
	name: "test",
	initialState: itemDetailAdapter.getInitialState(),
	extraReducers: builder => {
		builder.addCase(fetchOrderSummaryInfo.fulfilled, ((state, action) => {
			return itemDetailAdapter.setAll(state, action.payload.OrderDetail);
		}));
	}
});

export const ImagesSlice = createSlice({
	name: "test",
	initialState: imagesAdapter.getInitialState(),
	extraReducers: builder => {
		builder.addCase(fetchOrderSummaryInfo.fulfilled, ((state, action) => {
			return imagesAdapter.setAll(state, action.payload.Image);
		}));
	}
});


