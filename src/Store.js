import {combineReducers} from "redux";
import {configureStore} from "@reduxjs/toolkit";
import logger from "redux-logger";
import { reducer as modal } from 'redux-modal'
import WorkInstructionsReducer from "./components/work-instructions/InstructionData";
import WorkTypeReducer from "./components/worktypes/workTypesDataReducer";
import AreasReducer from "./components/areas/areaDataReducer";
import DocumentsReducer from "./components/documents/documentsDataReducer";
import formDataReducer from './components/forms/FormData';
import componentsReducer from "./components/ui-components/componentsReducer";
import { reducer as modalProvider } from 'react-redux-modal-provider';

const rootReducer = combineReducers({
    workInstructions: WorkInstructionsReducer,
    activities: "",
    workTypes: WorkTypeReducer,
    areas: AreasReducer,
    documents: DocumentsReducer,
    form: formDataReducer,
    components: componentsReducer,
    modal,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});
