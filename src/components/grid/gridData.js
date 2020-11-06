import {createSlice} from "@reduxjs/toolkit";

const gridDataSlice = createSlice(({
    name: 'gridData',
    initialState: {
        selectedNode: false,
        deleteGridRow: false,
    },
    reducers: {
        setSelectedNode: (state, action) => {
            state.selectedNode = action.payload
        },
        setDeleteGridRow: (state, action) => {
            state.deleteGridRow = action.payload
        },

        resetGridRow: (state) => {
            state.selectedNode = false
        },
    }
}))

export const {setSelectedNode, setDeleteGridRow, resetGridRow} = gridDataSlice.actions
export default gridDataSlice.reducer