import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import logger from "redux-logger";
import { reducer as modal } from "redux-modal";
import { persistReducer, persistStore } from "redux-persist";
import thunk from 'redux-thunk';
import storage from "redux-persist/lib/storage";
import { ExcelSlice } from "./components/import-data/ImportInstructionData";
import componentsReducer from "./components/ui-components/componentsReducer";
import ActivitiesReducer from "./services/data/activityData";
import ApplicationsReducer from "./services/data/ApplicationData";
import ApplicationDetails from "./services/data/ApplicationDetailsData";
import AreasReducer from "./services/data/areaData";
import DocumentsReducer from "./services/data/documentsData";
import formDataReducer from "./services/data/FormData";
import gridReducer, { SelectedRowSlice } from "./services/data/gridData";
import ImagesReducer from "./services/data/ImageData";
import {workInstructionsSlice, availableInstructionSlice} from "./services/data/InstructionData";
import InstructionDetailSlice from "./services/data/instructionDetailData";
import LocationsReducer from "./services/data/locationData";
import { SupervisorsSlice } from "./services/data/SupervisorsData";
import { AvailableWorksheetSlice, RecentWorksheetSlice }from "./services/data/WorksheetData";
import WorkTypeReducer from "./services/data/workTypesData";
import { InstructionHeaderSlice } from "./services/thunks";

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
	instructionHeader: workInstructionsSlice.reducer,
	editedRow: SelectedRowSlice.reducer,
	supervisors: SupervisorsSlice.reducer,
	applications: ApplicationsReducer,
	worksheetsAvailable: AvailableWorksheetSlice.reducer,
	worksheetsRecent: RecentWorksheetSlice.reducer,
	excelData: ExcelSlice.reducer,
	applicationDetail: ApplicationDetails,
	availableInstructions: availableInstructionSlice.reducer,

});

const persistConfig = { // configuration object for redux-persist
	key: "root",
	storage, // define which storage to use
	blacklist: ["worksheetsRecent"]
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
	reducer: persistedReducer,
	middleware: [thunk, logger]
});

const persistor = persistStore(store);

export { store, persistor };