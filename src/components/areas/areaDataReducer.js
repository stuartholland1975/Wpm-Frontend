import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosApi";

export const fetchAreas = createAsyncThunk("areas/fetchAll", async () => {
  const response = await axiosInstance.get("/wpm/api/areas/");
  return response.data;
});

export const updateArea = createAsyncThunk("area/updateOne", async (arg) => {
  const response = await axiosInstance.put(`/wpm/api/areas/${arg}`);
  return response.data;
});

export const areasAdapter = createEntityAdapter({
  sortComparer: (a, b) => a.area_code.localeCompare(b.area_code),
});

const initialState = areasAdapter.getInitialState();

const areaSlice = createSlice({
  name: "areas",
  initialState,
  reducers: {
    removeDocument: areasAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAreas.fulfilled, areasAdapter.upsertMany);
    builder.addCase(updateArea.fulfilled, (state, { payload }) => {
      const { id, ...changes } = payload;
      areasAdapter.updateOne(state, { id, changes });
    });
  },
});

export const { removeArea } = areaSlice.actions;

export const {
  selectById: selectAreaById,
  selectIds: selectAreaIds,
  selectEntities: selectAreaEntities,
  selectAll: selectAllAreas,
  selectTotal: selectTotalAreas,
} = areasAdapter.getSelectors((state) => state.areas);
export default areaSlice.reducer;
