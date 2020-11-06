import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosApi";

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
    const response = await axiosInstance.get(`/wpm/api/documents/${arg}`);
    return response.data;
  }
);

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
    builder.addCase(fetchDocuments.fulfilled, documentsAdapter.upsertMany);
    builder.addCase(updateDocument.fulfilled, (state, { payload }) => {
      const { id, ...changes } = payload;
      documentsAdapter.updateOne(state, { id, changes });
    });
  },
});

export const { removeDocument, resetDocuments } = documentsSlice.actions;

export const {
  selectById: selectDocumentById,
  selectIds: selectDocumentIds,
  selectEntities: selectDocumentEntities,
  selectAll: selectAllDocuments,
  selectTotal: selectTotalDocuments,
} = documentsAdapter.getSelectors((state) => state.documents);
export default documentsSlice.reducer;
