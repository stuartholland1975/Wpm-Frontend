import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import { updateWorksheet } from "../thunks";

const editedRowAdapter = createEntityAdapter();

export const SelectedRowSlice = createSlice({
  name: "editedRow",
  initialState: editedRowAdapter.getInitialState(),
  reducers: {
    setEditedRow: editedRowAdapter.upsertOne,
    resetEditedRow: editedRowAdapter.removeAll,
    removeEditedRow: editedRowAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder.addCase(updateWorksheet.fulfilled, editedRowAdapter.removeOne);
  },
});

export const {
  setEditedRow,
  resetEditedRow,
  removeEditedRow,
} = SelectedRowSlice.actions;
export const { selectAll: selectAllEditedRows } = editedRowAdapter.getSelectors(
  (state) => state.editedRow
);

const gridDataSlice = createSlice({
  name: "gridData",
  initialState: {
    selectedRow: false,
    clickedRow: false,
    selectedLocation: false,
    editedRow: [],
    deleteGridRow: false,
    selectedBillItem: false,
    selectedInstruction: false,
  },
  reducers: {
    setSelectedRow: (state, action) => {
      state.selectedRow = action.payload;
    },
    setSelectedLocation: (state, action) => {
      state.selectedLocation = action.payload;
    },
    setDeleteGridRow: (state, action) => {
      state.deleteGridRow = action.payload;
    },
    setClickedLocation(state, action) {
      state.clickedRow = action.payload;
    },
    setEditedRow: (state, action) => {
      state.editedRow = [...state.editedRow, ...action.payload];
    },
    resetGridRow: (state) => {
      state.selectedRow = false;
    },
    setSelectedBillItem: (state, action) => {
      state.selectedBillItem = action.payload;
    },
    setSelectedInstruction: (state, action) => {
      state.selectedInstruction = action.payload;
    },
  },
});

export const {
  setSelectedRow,
  setDeleteGridRow,
  resetGridRow,
  setClickedLocation,
  setSelectedLocation,
  setSelectedBillItem,
  setSelectedInstruction,
} = gridDataSlice.actions;
export default gridDataSlice.reducer;
