import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/components/api/axiosInstance";

const initialState = {
    coupons: [],
    loading: false,
    error: null,
};

export const fetchCoupons = createAsyncThunk("adminCoupon/fetchCoupons", async() => {
    const res = await axiosInstance.get("/api/coupons/all");
    return res.data.data;
});

export const createCoupon = createAsyncThunk("adminCoupon/createCoupon", async(data) => {
    const res = await axiosInstance.post("/api/coupons/create", data);
    return res.data.data;
});

export const updateCoupon = createAsyncThunk("adminCoupon/updateCoupon", async({ id, formData }) => {
    const res = await axiosInstance.put(`/api/coupons/update/${id}`, formData);
    return res.data.data;
});

export const deleteCoupon = createAsyncThunk("adminCoupon/deleteCoupon", async(id) => {
    await axiosInstance.delete(`/api/coupons/delete/${id}`);
    return id;
});

const adminCouponSlice = createSlice({
    name: "adminCoupon",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCoupons.pending, (state) => { state.loading = true; })
            .addCase(fetchCoupons.fulfilled, (state, action) => {
                state.loading = false;
                state.coupons = action.payload;
            })
            .addCase(fetchCoupons.rejected, (state) => {
                state.loading = false;
            })
            .addCase(createCoupon.fulfilled, (state, action) => {
                state.coupons.unshift(action.payload);
            })
            .addCase(updateCoupon.fulfilled, (state, action) => {
                const index = state.coupons.findIndex(c => c._id === action.payload._id);
                if (index !== -1) state.coupons[index] = action.payload;
            })
            .addCase(deleteCoupon.fulfilled, (state, action) => {
                state.coupons = state.coupons.filter(c => c._id !== action.payload);
            });
    },
});

export default adminCouponSlice.reducer;