import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import { reducer as modal } from "redux-modal";
import WorkInstructionsReducer from "./services/data/InstructionData";
import WorkTypeReducer from "./services/data/workTypesData";
import AreasReducer from "./services/data/areaData";
import DocumentsReducer from "./services/data/documentsData";
import formDataReducer from "./services/data/FormData";
import componentsReducer from "./components/ui-components/componentsReducer";
import gridReducer, {SelectedRowSlice} from "./services/data/gridData";
import LocationsReducer from "./services/data/locationData";
import InstructionDetailSlice from "./services/data/instructionDetailData";
import ImagesReducer from "./services/data/ImageData"
import { InstructionHeaderSlice } from "./services/thunks"
import {SupervisorsSlice} from "./services/data/SupervisorsData";
import ActivitiesReducer from "./services/data/activityData"
import ApplicationsReducer from "./services/data/ApplicationData";
import WorksheetsReducer from "./services/data/WorksheetData";
import {ExcelSlice} from "./components/import-data/ImportInstructionData";

const rootReducer = combineReducers({
	workInstructions: WorkInstructionsReducer,
	activities: ActivitiesReducer,
	locations: LocationsReducer,
	instructionDetails: InstructionDetailSlice,
	workTypes: WorkTypeReducer,
	images: ImagesReducer,
	areas: AreasReducer,
	documents: DocumentsReducer,
	form: formDataReducer,
	components: componentsReducer,
	modal,
	gridData: gridReducer,
	instructionHeader: InstructionHeaderSlice.reducer,
	editedRow: SelectedRowSlice.reducer,
	supervisors: SupervisorsSlice.reducer,
	applications: ApplicationsReducer,
	worksheets: WorksheetsReducer,
	excelData: ExcelSlice.reducer,

});

export const store = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});
