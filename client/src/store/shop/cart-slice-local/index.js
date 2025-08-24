import { createSlice } from "@reduxjs/toolkit";

/** 🔧 HELPER FUNCTIONS **/

export function getLocalCartItemsHelper() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveLocalCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function addLocalCartItem(cart, newItem) {
    const existingIndex = cart.findIndex(item => item.productId === newItem.productId);
    if (existingIndex !== -1) {
        cart[existingIndex].quantity += newItem.quantity;
    } else {
        cart.push(newItem);
    }
    saveLocalCart(cart);
    return cart;
}

function updateLocalCartQuantity(cart, productId, quantity) {
    const updatedCart = cart.map(item =>
        item.productId === productId ? {...item, quantity } : item
    );
    saveLocalCart(updatedCart);
    return updatedCart;
}

function deleteLocalCartItem(cart, productId) {
    const updatedCart = cart.filter(item => item.productId !== productId);
    saveLocalCart(updatedCart);
    return updatedCart;
}

export function clearLocalCartHelper() {
    localStorage.removeItem("cart");
    return [];
}

/** 🛒 REDUX SLICE **/

const localCartSlice = createSlice({
    name: "localcart",
    initialState: {
        items: getLocalCartItemsHelper(),
    },
    reducers: {
        addItem: (state, action) => {
            state.items = addLocalCartItem([...state.items], action.payload);
        },
        updateQuantity: (state, action) => {
            const { productId, quantity } = action.payload;
            state.items = updateLocalCartQuantity([...state.items], productId, quantity);
        },
        deleteItem: (state, action) => {
            state.items = deleteLocalCartItem([...state.items], action.payload);
        },
        refreshLocalCartState: (state) => {
            state.items = getLocalCartItemsHelper();
        },
        clearLocalCart: (state) => {
            state.items = clearLocalCartHelper();
        },
    },
});

export const {
    addItem,
    updateQuantity,
    deleteItem,
    refreshLocalCartState,
    clearLocalCart,
} = localCartSlice.actions;

export default localCartSlice.reducer;