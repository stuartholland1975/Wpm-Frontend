import {createAsyncThunk, createEntityAdapter, createSlice,} from "@reduxjs/toolkit";
import axiosInstance from '../../services/axiosApi';

export const fetchImages = createAsyncThunk(
    "images/fetchAll",
    async (orderId) => {
        const response = await axiosInstance.get(`/wpm/api/images/?location__work_instruction=${orderId}`);
        return response.data;
    }
);

export const updateImage = createAsyncThunk(
    "images/upsertOne",
    async (apiObject) => {
        const response = await axiosInstance.put(
            `/wpm/api/images/${apiObject.id}/`, apiObject
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
        return response.data
    }
);

export const deleteImage = createAsyncThunk(
    "images/deleteOne",
    async (imageId) => {
        await axiosInstance.delete(
            `/wpm/api/images/${imageId}/`
        );
        return imageId
    }
);

export const imagesAdapter = createEntityAdapter();

const initialState = imagesAdapter.getInitialState();

export const ImagesSlice = createSlice({
    name: 'images',
    initialState,
    extraReducers: builder => {
        builder.addCase(
            fetchImages.fulfilled,
            imagesAdapter.setAll
        );
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
})

export const {
    selectById: selectImageById,
    selectIds: selectImageIds,
    selectEntities: selectImageEntities,
    selectAll: selectAllImages,
    selectTotal: selectTotalImages,
} = imagesAdapter.getSelectors((state) => state.images);

export default ImagesSlice.reducer