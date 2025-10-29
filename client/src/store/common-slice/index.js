// store/common-slice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/components/api/axiosInstance";

const initialState = {
    isLoading: false,
    featureImageList: [],
};

// ⭐ Helper function to convert HTTP Cloudinary URLs to HTTPS
const convertImageToHttps = (imageObj) => {
    if (!imageObj) return imageObj;
    
    const converted = { ...imageObj };
    
    // Convert image field
    if (converted.image && typeof converted.image === 'string' && converted.image.startsWith('http://')) {
        converted.image = converted.image.replace('http://', 'https://');
    }
    
    return converted;
};

// Get all feature images
export const getFeatureImages = createAsyncThunk(
    "feature/getFeatureImages",
    async() => {
        const response = await axiosInstance.get("/api/common/feature/get");
        return response.data;
    }
);

// Add a feature image
export const addFeatureImage = createAsyncThunk(
    "feature/addFeatureImage",
    async(image) => {
        // ⭐ Convert to HTTPS before sending
        const secureImage = image.startsWith('http://') ? image.replace('http://', 'https://') : image;
        const response = await axiosInstance.post("/api/common/feature/add", { image: secureImage });
        return response.data;
    }
);

// Delete a feature image
export const deleteFeatureImage = createAsyncThunk(
    "feature/deleteFeatureImage",
    async(id) => {
        const response = await axiosInstance.delete(`/api/common/feature/delete/${id}`);
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
                // ⭐ Convert all feature images to HTTPS
                state.featureImageList = action.payload.data?.map(convertImageToHttps) || [];
            })
            .addCase(getFeatureImages.rejected, (state) => {
                state.isLoading = false;
                state.featureImageList = [];
            })

            .addCase(addFeatureImage.fulfilled, (state, action) => {
                // ⭐ Convert new image to HTTPS before adding to state
                state.featureImageList.push(convertImageToHttps(action.payload.data));
            })

            .addCase(deleteFeatureImage.fulfilled, (state, action) => {
                state.featureImageList = state.featureImageList.filter(
                    (img) => img._id !== action.payload.id
                );
            });
    },
});

export default commonSlice.reducer;