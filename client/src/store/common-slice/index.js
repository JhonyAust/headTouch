// store/common-slice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoading: false,
    featureImageList: [],
};

// Get all feature images
export const getFeatureImages = createAsyncThunk(
    "feature/getFeatureImages",
    async() => {
        const response = await axios.get("http://localhost:5000/api/common/feature/get");
        return response.data;
    }
);

// Add a feature image
export const addFeatureImage = createAsyncThunk(
    "feature/addFeatureImage",
    async(image) => {
        const response = await axios.post("http://localhost:5000/api/common/feature/add", { image });
        return response.data;
    }
);

// Delete a feature image
export const deleteFeatureImage = createAsyncThunk(
    "feature/deleteFeatureImage",
    async(id) => {
        const response = await axios.delete(`http://localhost:5000/api/common/feature/delete/${id}`);
        return { success: true, id };
    }
);

const commonSlice = createSlice({
    name: "commonSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getFeatureImages.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getFeatureImages.fulfilled, (state, action) => {
                state.isLoading = false;
                state.featureImageList = action.payload.data;
            })
            .addCase(getFeatureImages.rejected, (state) => {
                state.isLoading = false;
                state.featureImageList = [];
            })

        .addCase(addFeatureImage.fulfilled, (state, action) => {
            state.featureImageList.push(action.payload.data);
        })

        .addCase(deleteFeatureImage.fulfilled, (state, action) => {
            state.featureImageList = state.featureImageList.filter(
                (img) => img._id !== action.payload.id
            );
        });
    },
});

export default commonSlice.reducer;