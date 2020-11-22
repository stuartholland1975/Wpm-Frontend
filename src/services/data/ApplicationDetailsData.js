import { createSlice } from "@reduxjs/toolkit";
import { fetchAppDetails } from "../thunks";

const initialState = {
	orders: [],
	items: [],
	locations: [],
	images: [],
	exportData: false,
};

const ApplicationDetails = createSlice({
	name: "applicationDetails",
	initialState: initialState,
	reducers: {
		resetApplicationDetails: (state) => state = initialState,
		exportApplicationDetails: (state, action) => {
			state.exportData = action.payload;
		},
	},
	extraReducers: builder => {
		builder.addCase(fetchAppDetails.fulfilled, (state, action) => {
			state.orders = action.payload["OrderHeader"];
			state.items = action.payload["OrderDetail"];
			state.locations = action.payload["SiteLocation"];
			state.images =
				action.payload.Image.map(({construction_image, image_type, title, id, site_location, gps_lat, gps_long, gps_date, exif, location, camera, gps_position}) => {
					const container = {};
					container.title = title;
					container.construction_image = construction_image;
					container.image_type = image_type;
					container.id = id;
					container.imageTypeDescription = image_type + "  Construction Image";
					container.locationRef = site_location;
					container.gps_lat = gps_lat;
					container.gps_long = gps_long;
					container.gps_date = gps_date;
					container.exif = exif;
					container.location = location;
					container.camera = camera;
					container.gps_position = gps_position;
					return container;
				});
		});
	}
});

export const {resetApplicationDetails, exportApplicationDetails} = ApplicationDetails.actions;

export default ApplicationDetails.reducer;