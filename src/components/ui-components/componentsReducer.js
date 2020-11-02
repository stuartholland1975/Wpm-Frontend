import {createSlice} from "@reduxjs/toolkit";


const componentSlice = createSlice({
    name: 'components',
    initialState: {
        showModal: false,
        modalTitle: "",
        modalContent: "",
        modalProps: {}
    },
    reducers: {
        toggleModal: (state, action) => {
            state.showModal = action.payload
        },
        modalSettings: (state, action) => {
            state.modalTitle = action.payload.title
            state.modalContent = action.payload.content
        }
    }
})
export const {toggleModal, modalSettings} = componentSlice.actions
export default componentSlice.reducer