import { createAsyncThunk, createEntityAdapter, createSlice, } from "@reduxjs/toolkit";
import moment from "moment";
import axiosInstance from "./axiosApi";

export const fetchActivities = createAsyncThunk(
	"activities/fetchAll",
	async () => {
		const activities = await axiosInstance.get("/wpm/api/activity/");
		return activities.data;
	}
);

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
		const supervisors = await axiosInstance.get(`/wpm/api/supervisors/`);

		return supervisors.data;
	}
);

export const fetchAppInstructions = createAsyncThunk(
	"appInstructions/fetchAll",
	async (appNumber) => {
		const appInstructions = await axiosInstance.get(`/wpm/api/orderheader/?orderdetail__worksheet__application_number=${ appNumber }`);
		return appInstructions.data;
	}
);

export const fetchWorkInstructions = createAsyncThunk(
	"workInstructions/fetchAll",
	async () => {
		const headers = await axiosInstance.get("/wpm/api/orderheader/");
		const documents = await axiosInstance.get("/wpm/api/documents/");
		const instructionData = headers.data.map((element) => {
			return {
				...element,
				document_count: documents.data.filter(
					(obj) => obj.work_instruction === element.id
				).length,
			};
		});

		return instructionData;
	}
);

export const updateWorkInstruction = createAsyncThunk(
	"workInstructions/upsertOne",
	async (apiObject) => {
		const response = await axiosInstance.put(
			`/wpm/api/orderheader/${ apiObject.id }/`,
			apiObject
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
		const response = await axiosInstance.patch(
			`/wpm/api/orderdetail/${ apiObject.id }/`,
			apiObject
		);
		return response.data;
	}
);

export const updateInstructionDetailStatus = createAsyncThunk(
	"instructionDetail/upsertOne",
	async (apiObject) => {
		const response = await axiosInstance.patch(
			`/wpm/api/orderdetail/${ apiObject.id }/`,
			apiObject
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
		return {
			...response.data,
			qty_complete: 0,
			value_complete: 0,
			qty_applied: 0,
			value_applied: 0,
			qty_os: 0,
		};
	}
);

export const deleteInstructionDetail = createAsyncThunk(
	"instructionDetails/deleteOne",
	async (itemId) => {
		const response = await axiosInstance.delete(
			`/wpm/api/orderdetail/${ itemId }/`
		);
		return itemId;
	}
);

export const fetchApplications = createAsyncThunk(
	"applications/fetchAll",
	async () => {
		const applications = await axiosInstance.get("/wpm/api/applications/");
		return applications.data;
	}
);

export const newWorksheet = createAsyncThunk(
	"worksheet/addOne",
	async (apiObject) => {
		const response = await axiosInstance.post(`/wpm/api/worksheet/`, apiObject);
		return response.data;
	}
);

export const updateWorksheet = createAsyncThunk(
	"worksheet/updateOne",
	async (apiObject) => {
		const response = await axiosInstance.patch(
			`/wpm/api/worksheet/${ apiObject.id }/`,
			apiObject
		);
		return response.data.id;
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

export const newDocument = createAsyncThunk(
	"worksheet/addOne",
	async (apiObject) => {
		const response = await axiosInstance.post(`/wpm/api/documents/`, apiObject);
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
			worksheet_ref: `${ response.data.work_instruction }/${ response.data.id }`,
		};
		const responseWithRef = await axiosInstance.patch(
			`/wpm/api/sitelocation/${ worksheetRef.id }/`,
			worksheetRef
		);
		const updatedLocation = await axiosInstance.get(
			`/wpm/api/sitelocation/${ responseWithRef.data.id }`
		);
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

export const fetchAppLocations = createAsyncThunk(
	"appLocations/fetchAll",
	async (appId) => {
		const response = await axiosInstance.get(`/wpm/api/sitelocation/?worksheet__application_number=${ appId }`);
		return response.data;
	}
);

export const fetchAppItems = createAsyncThunk(
	"appItems/fetchAll",
	async (appId) => {
		const response = await axiosInstance.get(`/wpm/api/orderdetail/?worksheet__application_number=${ appId }`);
		return response.data;
	}
);

export const fetchSelectedImages = createAsyncThunk(
	"images/fetchAll",
	async (selection) => {
		const response = await axiosInstance.get(`wpm/api/images/?location_in=${ selection }`);
		return response.data;
	}
);

export const fetchSelectedActivities = createAsyncThunk(
	"activities/fetchSelected",
	async (selection) => {
		const response = await axiosInstance.get(`wpm/api/activity/?activity_in=${ selection }`);
		return response.data;
	}
);

export const fetchAvailableWorksheets = createAsyncThunk(
	"availableWorksheets/fetchAll",
	async (search) => {
		const worksheetData = await axiosInstance.get(
			`/wpm/api/worksheet/${ search }`
		);
		return worksheetData.data;
	}
);

export const closeApplication = createAsyncThunk(
	"application/Close&Create",
	async () => {
		const currentApp = await axiosInstance.get("/wpm/commercial/applications/current");
		const closedApp = await axiosInstance.put(`/wpm/api/applications/${ currentApp.data[0].id }/`, {
			...currentApp.data[0],
			app_current: false,
			app_open: false
		});
		const lastAppDate = moment(closedApp.data.app_date).add(7, "days").format('YYYY-MM-DD')
		const newApp = {
			app_number: closedApp.data.app_number + 1,
			app_date: lastAppDate,
			app_ref: `Application ${ closedApp.data.app_number + 1 } `,
			app_open: true,
			app_current: true,
		};

		const response = await axiosInstance.post(`/wpm/api/applications/`, newApp);
		const applications = await axiosInstance.get("/wpm/api/applications/");
		return applications.data;
	}
);

const instructionHeaderAdapter = createEntityAdapter();
const locationsAdapter = createEntityAdapter();
const itemDetailAdapter = createEntityAdapter();
const imagesAdapter = createEntityAdapter();

export const InstructionHeaderSlice = createSlice({
	name: "test",
	initialState: instructionHeaderAdapter.getInitialState(),
	extraReducers: (builder) => {
		builder.addCase(fetchOrderSummaryInfo.fulfilled, (state, action) => {
			return instructionHeaderAdapter.setAll(state, action.payload.OrderHeader);
		});
	},
});

export const {
	selectAll: selectAllInstructionHeaders,
} = instructionHeaderAdapter.getSelectors((state) => state.instructionHeader);

export const LocationsSlice = createSlice({
	name: "test",
	initialState: locationsAdapter.getInitialState(),
	extraReducers: (builder) => {
		builder.addCase(fetchOrderSummaryInfo.fulfilled, (state, action) => {
			return locationsAdapter.setAll(state, action.payload.SiteLocation);
		});
	},
});

export const InstructionDetailDataSlice = createSlice({
	name: "test",
	initialState: itemDetailAdapter.getInitialState(),
	extraReducers: (builder) => {
		builder.addCase(fetchOrderSummaryInfo.fulfilled, (state, action) => {
			return itemDetailAdapter.setAll(state, action.payload.OrderDetail);
		});
	},
});

export const ImagesSlice = createSlice({
	name: "test",
	initialState: imagesAdapter.getInitialState(),
	extraReducers: (builder) => {
		builder.addCase(fetchOrderSummaryInfo.fulfilled, (state, action) => {
			return imagesAdapter.setAll(state, action.payload.Image);
		});
	},
});
