import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import WorkInstructionsReducer from './components/work-instructions/InstructionData';


const rootReducer = combineReducers({
    workInstructions: WorkInstructionsReducer,
    activities: ''
})


export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  })

