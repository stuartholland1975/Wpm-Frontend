import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import { reducer as modal } from "redux-modal";
import WorkInstructionsReducer from "./components/work-instructions/InstructionData";
import WorkTypeReducer from "./components/worktypes/workTypesDataReducer";
import AreasReducer from "./components/areas/areaDataReducer";
import DocumentsReducer from "./components/documents/documentsDataReducer";
import formDataReducer from "./components/forms/FormData";
import componentsReducer from "./components/ui-components/componentsReducer";
import gridReducer, {SelectedRowSlice} from "./components/grid/gridData";
import LocationsReducer from "./components/locations/locationData";
import InstructionDetailSlice from "./components/work-instructions/instructionDetailData";
import ImagesReducer from "./components/images/ImageData"
import { InstructionHeaderSlice } from "./services/thunks"
import {SupervisorsSlice} from "./components/supervisors/SupervisorsData";
import ActivitiesReducer from "./components/activities/activityData"

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
	supervisors: SupervisorsSlice.reducer

});

export const store = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});
