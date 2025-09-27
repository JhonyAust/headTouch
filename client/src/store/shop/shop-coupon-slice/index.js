import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/components/api/axiosInstance";

const initialState = {
    appliedCoupon: null,
    discount: 0,
    loading: false,
    error: null,
};

export const validateCoupon = createAsyncThunk(
    "coupon/validateCoupon",
    async(code, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post("/api/coupons/validate", { code });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response ?.data ?.message || "Coupon validation failed");
        }
    }
);

const couponSlice = createSlice({
    name: "coupon",
    initialState,
    reducers: {
        resetCoupon: (state) => {
            state.appliedCoupon = null;
            state.discount = 0;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(validateCoupon.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(validateCoupon.fulfilled, (state, action) => {
                state.loading = false;
                state.appliedCoupon = action.payload.data;
                state.discount = action.payload.discount;
            })
            .addCase(validateCoupon.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetCoupon } = couponSlice.actions;
export default couponSlice.reducer;