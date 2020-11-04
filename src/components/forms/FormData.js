import {createSlice} from "@reduxjs/toolkit";

const formDataSlice = createSlice(({
    name: 'formData',
    initialState: {
        formData: [],
        initialData: {},
    },
    reducers: {
        setFormData: (state, action) => {
            state.formData = action.payload
        },
        setInitialData: (state, action) => {
            state.initialData = action.payload
        }
    }
}))

export const {setFormData, setInitialData} = formDataSlice.actions
export default formDataSlice.reducer