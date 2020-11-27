import { createSlice } from "@reduxjs/toolkit";


const componentSlice = createSlice({
	name: "components",
	initialState: {
		showModal: false,
		modalTitle: "",
		modalContent: "",
		modalProps: {},
		editRow: false,
	},
	reducers: {
		toggleModal: (state, action) => {
			state.showModal = action.payload;
		},
		modalSettings: (state, action) => {
			state.modalTitle = action.payload.title;
			state.modalContent = action.payload.content;
		},
		editRow: (state, action) => {
			state.editRow = action.payload;
		}
	}
});
export const {toggleModal} = componentSlice.actions;
export default componentSlice.reducer;
