import { createAsyncThunk, createEntityAdapter, createSlice, } from "@reduxjs/toolkit";
import axiosInstance from "../axiosApi";
import { fetchOrderSummaryInfo, fetchSelectedImages } from "../thunks";

export const updateImage = createAsyncThunk(
	"images/upsertOne",
	async (apiObject) => {
		const response = await axiosInstance.put(
			`/wpm/api/images/${ apiObject.id }/`, apiObject
		);
		return response.data;
	}
);

export const newImage = createAsyncThunk(
	"images/addOne",
	async (apiObject) => {
		const response = await axiosInstance.post(
			`/wpm/api/images/`,
			apiObject
		);
		return response.data;
	}
);

export const deleteImage = createAsyncThunk(
	"images/deleteOne",
	async (imageId) => {
		await axiosInstance.delete(
			`/wpm/api/images/${ imageId }/`
		);
		return imageId;
	}
);

export const imagesAdapter = createEntityAdapter({
	sortComparer: (a, b) => a.location.toString().localeCompare(b.location),
});

const initialState = imagesAdapter.getInitialState();

export const ImagesSlice = createSlice({
	name: "images",
	initialState,
	reducers: {
		resetImages: imagesAdapter.removeAll,
	},
	extraReducers: builder => {
		builder.addCase(fetchOrderSummaryInfo.fulfilled, ((state, action) => {
			return imagesAdapter.setAll(state,
				action.payload.Image.map(({construction_image, image_type, title, id, site_location, gps_lat, gps_long, gps_date, exif, location, gps_position, camera}) => {
					const container = {};
					container.title = title;
					container.construction_image = construction_image;
					container.imageType = image_type;
					container.id = id;
					container.imageTypeDescription = image_type + "  Construction Image";
					container.locationRef = site_location;
					container.gps_lat = gps_lat;
					container.gps_long = gps_long;
					container.gps_position = gps_position;
					container.gps_date = gps_date;
					container.camera = camera;
					container.exif = exif;
					container.location = location;
					return container;
				}));
		}));
		builder.addCase(fetchSelectedImages.fulfilled, ((state, action) => {
			return imagesAdapter.setAll(state,
				action.payload.map(({construction_image, image_type, title, id, site_location, gps_lat, gps_long, gps_date, exif, location}) => {
					const container = {};
					container.title = title;
					container.construction_image = construction_image;
					container.imageType = image_type;
					container.id = id;
					container.imageTypeDescription = image_type + "  Construction Image";
					container.locationRef = site_location;
					container.gps_lat = gps_lat;
					container.gps_long = gps_long;
					container.gps_date = gps_date;
					container.exif = exif;
					container.location = location;
					return container;
				}));
		}));
		builder.addCase(
			updateImage.fulfilled,
			imagesAdapter.upsertOne
		);
		builder.addCase(
			newImage.fulfilled,
			imagesAdapter.addOne
		);
		builder.addCase(
			deleteImage.fulfilled,
			imagesAdapter.removeOne
		);
	},
});

export const {
	selectById: selectImageById,
	selectIds: selectImageIds,
	selectEntities: selectImageEntities,
	selectAll: selectAllImages,
	selectTotal: selectTotalImages,
} = imagesAdapter.getSelectors((state) => state.images);

export const {resetImages} = ImagesSlice.actions;

export default ImagesSlice.reducer;
