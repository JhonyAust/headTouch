import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/components/api/axiosInstance";
const initialState = {
    cartItems: [],
    isLoading: false,
};

export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async({ userId, productId, quantity, image }) => {
        const response = await axiosInstance.post("/api/shop/cart/add", {
            userId,
            productId,
            quantity,
            image,
        });
        console.log("Image it is:", image);
        return response.data;
    }
);


export const fetchCartItems = createAsyncThunk(
    "cart/fetchCartItems",
    async(userId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(
                `/api/shop/cart/get/${userId}`
            );
            console.log("The Cart Response Data:", response.data);
            return response.data;
        } catch (error) {
            console.error("Fetch cart error:", error);
            // Return empty cart on error instead of rejecting
            return {
                success: true,
                data: {
                    cartId: null,
                    userId: userId,
                    items: [],
                },
            };
        }
    }
);
export const deleteCartItem = createAsyncThunk(
    "cart/deleteCartItem",
    async({ userId, productId }) => {
        const response = await axiosInstance.delete(
            `/api/shop/cart/${userId}/${productId}`
        );

        return response.data;
    }
);

export const updateCartQuantity = createAsyncThunk(
    "cart/updateCartQuantity",
    async({ userId, productId, quantity }) => {
        const response = await axiosInstance.put(
            "/api/shop/cart/update-cart", {
                userId,
                productId,
                quantity,

            }
        );

        return response.data;
    }
);

const shoppingCartSlice = createSlice({
    name: "shoppingCart",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addToCart.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = action.payload.data;
            })
            .addCase(addToCart.rejected, (state) => {
                state.isLoading = false;
                state.cartItems = [];
            })
            .addCase(fetchCartItems.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchCartItems.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = action.payload.data;
            })
            .addCase(fetchCartItems.rejected, (state) => {
                state.isLoading = false;
                state.cartItems = [];
            })
            .addCase(updateCartQuantity.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateCartQuantity.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = action.payload.data;
            })
            .addCase(updateCartQuantity.rejected, (state) => {
                state.isLoading = false;
                state.cartItems = [];
            })
            .addCase(deleteCartItem.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteCartItem.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = action.payload.data;
            })
            .addCase(deleteCartItem.rejected, (state) => {
                state.isLoading = false;
                state.cartItems = [];
            });
    },
});

export default shoppingCartSlice.reducer;