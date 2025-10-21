import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "@/components/api/axiosInstance";

const initialState = {
    isLoading: false,
    reviews: [],
};

export const addReview = createAsyncThunk(
    "/order/addReview",
    async(formdata, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `/api/shop/review/add`,
                formdata
            );
            return response.data;
        } catch (error) {
            // Return the exact error message from backend
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({
                success: false,
                message: "❌ Network error. Please try again later."
            });
        }
    }
);

export const getReviews = createAsyncThunk("/order/getReviews", async(id) => {
    const response = await axiosInstance.get(
        `/api/shop/review/${id}`
    );

    return response.data;
});

const reviewSlice = createSlice({
    name: "reviewSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addReview.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addReview.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(addReview.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(getReviews.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getReviews.fulfilled, (state, action) => {
                state.isLoading = false;
                state.reviews = action.payload.data;
            })
            .addCase(getReviews.rejected, (state) => {
                state.isLoading = false;
                state.reviews = [];
            });
    },
});

export default reviewSlice.reducer;