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
        }
        
    }
}))

export const {setSelectedNode, setDeleteGridRow} = gridDataSlice.actions
export default gridDataSlice.reducer