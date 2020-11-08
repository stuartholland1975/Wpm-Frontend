import { createSlice } from "@reduxjs/toolkit";

const gridDataSlice = createSlice(({
	name: 'gridData',
	initialState: {
		selectedRow: false,
		clickedRow: false,
		selectedLocation: false,
		deleteGridRow: false,
	},
	reducers: {
		setSelectedRow: (state, action) => {
			state.selectedRow = action.payload
		},
		setSelectedLocation: (state, action) => {
			state.selectedLocation = action.payload
		},
		setDeleteGridRow: (state, action) => {
			state.deleteGridRow = action.payload
		},
		setClickedLocation(state, action) {
			state.clickedRow = action.payload
		},
		resetGridRow: (state) => {
			state.selectedNode = false
		},
	}
}))

export const {setSelectedRow, setDeleteGridRow, resetGridRow, setClickedLocation, setSelectedLocation} = gridDataSlice.actions
export default gridDataSlice.reducer
