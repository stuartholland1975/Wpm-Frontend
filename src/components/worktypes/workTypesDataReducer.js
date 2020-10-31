import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosApi";

export const fetchWorkTypes = createAsyncThunk(
  "workTypes/fetchAll",
  async () => {
    const response = await axiosInstance.get("/wpm/api/worktypes/");
    return response.data;
  }
);

export const updateWorkType = createAsyncThunk(
  "worktypes/updateOne",
  async (arg) => {
    const response = await axiosInstance.get(`/wpm/api/worktypes/${arg}`);
    return response.data;
  }
);

export const workTypesAdapter = createEntityAdapter();

const initialState = workTypesAdapter.getInitialState();

const workTypesSlice = createSlice({
  name: "workTypes",
  initialState,
  reducers: {
    removeDocument: workTypesAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchWorkTypes.fulfilled, workTypesAdapter.upsertMany);
    builder.addCase(updateWorkType.fulfilled, (state, { payload }) => {
      const { id, ...changes } = payload;
      workTypesAdapter.updateOne(state, { id, changes });
    });
  },
});

export const { removeWorkType } = workTypesSlice.actions;

export const {
  selectById: selectWorkTypeById,
  selectIds: selectWorkTypeIds,
  selectEntities: selectWorkTypeEntities,
  selectAll: selectAllWorkTypes,
  selectTotal: selectTotalWorkTypes,
} = workTypesAdapter.getSelectors((state) => state.workTypes);
export default workTypesSlice.reducer;
