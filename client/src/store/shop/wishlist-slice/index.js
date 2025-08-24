import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    items: [],
    isLoading: false,
};

// Fetch wishlist items
export const fetchWishlist = createAsyncThunk(
    "wishlist/fetchWishlist",
    async (userId) => {
        const response = await axios.get(`http://localhost:5000/api/wishlist/${userId}`);
        return response.data;
    }
);

// Toggle wishlist item (add or remove)
export const toggleWishlistItem = createAsyncThunk(
    "wishlist/toggleWishlistItem",
    async ({ userId, productId }, thunkAPI) => {
        const response = await axios.post("http://localhost:5000/api/wishlist/toggle", {
            userId,
            productId,
        });

        // Optionally refetch wishlist after toggling
        thunkAPI.dispatch(fetchWishlist(userId));

        return response.data;
    }
);

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        clearWishlist: (state) => {
            state.items = [];
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchWishlistItems
            .addCase(fetchWishlist.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload.products || [];
            })
            .addCase(fetchWishlist.rejected, (state) => {
                state.isLoading = false;
                state.items = [];
            })

            // toggleWishlistItem (set loading just to true briefly if needed)
            .addCase(toggleWishlistItem.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(toggleWishlistItem.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(toggleWishlistItem.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
