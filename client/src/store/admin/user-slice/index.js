import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Get all users
export const getAllUsersForAdmin = createAsyncThunk(
    "admin/getAllUsers",
    async() => {
        const response = await axios.get("http://localhost:5000/api/admin/users", {
            withCredentials: true,
        });
        console.log("Users from backend:", response.data);
        return response.data;
    }
);

// ✅ Get weekly user stats
export const fetchUserStats = createAsyncThunk(
    "admin/fetchUserStats",
    async() => {
        const response = await axios.get("http://localhost:5000/api/admin/users/stats/weekly", {
            withCredentials: true,
        });
        console.log("Weekly user stats:", response.data.data);
        return response.data.data;
    }
);

const adminUserSlice = createSlice({
    name: "adminUser",
    initialState: {
        users: [],
        loadingUsers: false,
        error: null,

        // Weekly stats
        userStats: {
            thisWeekUsers: 0,
            lastWeekUsers: 0,
            percentChange: 0,
        },
        loadingUserStats: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        // ✅ Get all users
            .addCase(getAllUsersForAdmin.pending, (state) => {
                state.loadingUsers = true;
                state.error = null;
            })
            .addCase(getAllUsersForAdmin.fulfilled, (state, action) => {
                state.loadingUsers = false;
                state.users = action.payload.data;
            })
            .addCase(getAllUsersForAdmin.rejected, (state, action) => {
                state.loadingUsers = false;
                state.error = action.error.message;
            })

        // ✅ Weekly user stats
        .addCase(fetchUserStats.pending, (state) => {
                state.loadingUserStats = true;
            })
            .addCase(fetchUserStats.fulfilled, (state, action) => {
                state.loadingUserStats = false;
                state.userStats = action.payload;
            })
            .addCase(fetchUserStats.rejected, (state, action) => {
                state.loadingUserStats = false;
                state.error = action.error.message;
            });
    },
});

export default adminUserSlice.reducer;