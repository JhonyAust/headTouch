import { createSlice } from "@reduxjs/toolkit";

// Get wishlist from localStorage
const getLocalWishlist = () => {
    try {
        const stored = localStorage.getItem("wishlist");
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};
export const getLocalWishlistItemsHelper = () => {
    try {
        const stored = localStorage.getItem("wishlist");
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

export const clearLocalWishlistHelper = () => {
    localStorage.removeItem("wishlist");
};


// Save wishlist to localStorage
const saveLocalWishlist = (wishlist) => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
};

const localWishlistSlice = createSlice({
    name: "localWishlist",
    initialState: {
        items: getLocalWishlist(),
    },
    reducers: {
        toggleLocalWishlistItem: (state, action) => {
            const productId = action.payload;
            const index = state.items.indexOf(productId);
            if (index !== -1) {
                state.items.splice(index, 1); // Remove
            } else {
                state.items.push(productId); // Add
            }
            saveLocalWishlist(state.items);
        },
        clearLocalWishlist: (state) => {
            state.items = [];
            saveLocalWishlist([]);
        },
        loadLocalWishlist: (state) => {
            state.items = getLocalWishlist();
        },
    },
});

export const {
    toggleLocalWishlistItem,
    clearLocalWishlist,
    loadLocalWishlist,
} = localWishlistSlice.actions;

export default localWishlistSlice.reducer;