import { createSlice } from "@reduxjs/toolkit";

const formDataSlice = createSlice(({
	name: "formData",
	initialState: {
		formData: [],
		initialData: {},
	},
	reducers: {
		setFormData: (state, action) => {
			state.formData = action.payload;
		},
		setInitialData: (state, action) => {
			state.initialData = action.payload;
		},
		updateData: (state, action) => {
			state.initialData[action.payload.field] = action.payload.value;
		}
	}
}));

export const {setFormData, setInitialData, updateData} = formDataSlice.actions;
export default formDataSlice.reducer;
