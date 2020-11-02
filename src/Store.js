import { combineReducers } from "redux";
import { configureStore, createSlice } from "@reduxjs/toolkit";
import logger from "redux-logger";
import WorkInstructionsReducer from "./components/work-instructions/InstructionData";
import WorkTypeReducer from "./components/worktypes/workTypesDataReducer";
import AreasReducer from "./components/areas/areaDataReducer";
import DocumentsReducer from "./components/documents/documentsDataReducer";
import { reducer as formReducer } from 'redux-form'
import { reducer as modal } from 'redux-modal'

const rootReducer = combineReducers({
  workInstructions: WorkInstructionsReducer,
  activities: "",
  workTypes: WorkTypeReducer,
  areas: AreasReducer,
  documents: DocumentsReducer,
  form: formReducer,
  modal,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});
