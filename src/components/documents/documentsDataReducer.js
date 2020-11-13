import { createAsyncThunk, createEntityAdapter, createSlice, } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosApi";
import { fetchDocuments, updateDocument, fetchOrderSummaryInfo } from "../../services/thunks";



export const documentsAdapter = createEntityAdapter();

const initialState = documentsAdapter.getInitialState();

const documentsSlice = createSlice({
	name: "documents",
	initialState,
	reducers: {
		removeDocument: documentsAdapter.removeOne,
		resetDocuments: documentsAdapter.removeAll,
	},
	extraReducers: (builder) => {
		builder.addCase(fetchOrderSummaryInfo.fulfilled, ((state, action) => {
			return documentsAdapter.setAll(state, action.payload.Document);
		}));
		builder.addCase(updateDocument.fulfilled, (state, {payload}) => {
			const {id, ...changes} = payload;
			documentsAdapter.updateOne(state, {id, changes});
		});
	},
});

export const {removeDocument, resetDocuments} = documentsSlice.actions;

export const {
	selectById: selectDocumentById,
	selectIds: selectDocumentIds,
	selectEntities: selectDocumentEntities,
	selectAll: selectAllDocuments,
	selectTotal: selectTotalDocuments,
} = documentsAdapter.getSelectors((state) => state.documents);
export default documentsSlice.reducer;
