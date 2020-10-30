import { combineReducers } from "redux";
import { configureStore, createSlice } from "@reduxjs/toolkit";
import logger from "redux-logger";
import WorkInstructionsReducer from './components/work-instructions/InstructionData';

const drawerViewSlice = createSlice({
    name: 'drawer',
    initialState: {open: true},
    reducers : {
        toggleDrawerView(state, action) {
            state.open = action.payload
        }
    }
})

export const {toggleDrawerView} = drawerViewSlice.actions

const rootReducer = combineReducers({
    workInstructions: WorkInstructionsReducer,
    activities: '',
    drawer: drawerViewSlice.reducer
})


export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  })

