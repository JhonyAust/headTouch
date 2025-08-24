import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isOpen: false,
    mode: "login", // "login" or "register"
};

const loginRegisterSlice = createSlice({
    name: "loginRegister",
    initialState,
    reducers: {
        openLoginPopup: (state) => {
            state.isOpen = true;
            state.mode = "login";
        },
        openRegisterPopup: (state) => {
            state.isOpen = true;
            state.mode = "register";
        },
        switchToLogin: (state) => {
            state.mode = "login";
        },
        switchToRegister: (state) => {
            state.mode = "register";
        },
        closePopup: (state) => {
            state.isOpen = false;
        },
    },
});

export const {
    openLoginPopup,
    openRegisterPopup,
    switchToLogin,
    switchToRegister,
    closePopup,
} = loginRegisterSlice.actions;

export default loginRegisterSlice.reducer;