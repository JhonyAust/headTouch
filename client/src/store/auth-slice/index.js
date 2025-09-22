import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/components/api/axiosInstance";
import { auth, googleProvider } from "../../Firebase/firebase"
import { signInWithPopup, signOut } from "firebase/auth";

const initialState = {
    isAuthenticated: false,
    isLoading: true,
    user: null,
};

export const registerUser = createAsyncThunk(
    "/auth/register",

    async(formData) => {
        const response = await axiosInstance.post(
            "/api/auth/register",
            formData, {
                withCredentials: true,
            }
        );

        return response.data;
    }
);

export const loginUser = createAsyncThunk(
    "/auth/login",

    async(formData) => {
        const response = await axiosInstance.post(
            "/api/auth/login",
            formData, {
                withCredentials: true,
            }
        );

        return response.data;
    }
);

export const logoutUser = createAsyncThunk(
    "/auth/logout",

    async() => {
        const response = await axiosInstance.post(
            "/api/auth/logout", {}, {
                withCredentials: true,
            }
        );

        return response.data;
    }
);

export const checkAuth = createAsyncThunk(
    "/auth/checkauth",

    async() => {
        const response = await axiosInstance.get(
            "/api/auth/check-auth", {
                withCredentials: true,
                headers: {
                    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
                },
            }
        );

        return response.data;
    }
);

export const loginWithGoogle = createAsyncThunk(
  "auth/loginWithGoogle",
  async (_, thunkAPI) => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Firebase login result:", result); // 🔹

      const user = result.user;

      const response = await axiosInstance.post(
        "/api/auth/google-login",
        {
          email: user.email,
          userName: user.displayName,
        },
        { withCredentials: true }
      );

      console.log("Backend response:", response.data);

      return response.data;
    } catch (err) {
      console.error("Google login error:", err); 
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);


// Firebase logout
export const logoutWithGoogle = createAsyncThunk(
  "auth/logoutWithGoogle",
  async () => {
    await signOut(auth);
    return { success: true };
  }
);


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {},
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                console.log(action);

                state.isLoading = false;
                state.user = action.payload.success ? action.payload.user : null;
                state.isAuthenticated = action.payload.success;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(checkAuth.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.success ? action.payload.user : null;
                state.isAuthenticated = action.payload.success;
            })
            .addCase(checkAuth.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(logoutUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(loginWithGoogle.pending, (state) => {
            state.isLoading = true;
            })
            .addCase(loginWithGoogle.fulfilled, (state, action) => {
              state.isLoading = false;
              state.user = action.payload.user;
              state.isAuthenticated = true;
            })
            .addCase(loginWithGoogle.rejected, (state) => {
              state.isLoading = false;
              state.user = null;
              state.isAuthenticated = false;
            })
            .addCase(logoutWithGoogle.fulfilled, (state) => {
              state.isLoading = false;
              state.user = null;
              state.isAuthenticated = false;
            });
            
    },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;