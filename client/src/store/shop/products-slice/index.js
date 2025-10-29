import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/components/api/axiosInstance";

const initialState = {
  isLoading: false,
  productList: [],
  productDetails: null,
};

// ⭐ Helper function to convert HTTP Cloudinary URLs to HTTPS
const convertImagesToHttps = (product) => {
  if (!product) return product;
  
  const converted = { ...product };
  
  // Convert images array
  if (converted.images && Array.isArray(converted.images)) {
    converted.images = converted.images.map(img => 
      typeof img === 'string' && img.startsWith('http://') 
        ? img.replace('http://', 'https://') 
        : img
    );
  }
  
  // Convert single image field if exists
  if (converted.image && typeof converted.image === 'string' && converted.image.startsWith('http://')) {
    converted.image = converted.image.replace('http://', 'https://');
  }
  
  return converted;
};

export const fetchAllFilteredProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async ({ filterParams, sortParams }) => {
    console.log(fetchAllFilteredProducts, "fetchAllFilteredProducts");

    const query = new URLSearchParams({
      ...filterParams,
      sortBy: sortParams,
    });

    const result = await axiosInstance.get(
      `/api/shop/products/get?${query}`
    );

    console.log(result);

    return result?.data;
  }
);

export const fetchProductDetails = createAsyncThunk(
  "/products/fetchProductDetails",
  async (id) => {
    const result = await axiosInstance.get(
      `/api/shop/products/get/${id}`
    );

    return result?.data;
  }
);

const shoppingProductSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {
    setProductDetails: (state) => {
      state.productDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilteredProducts.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        // ⭐ Convert all product images to HTTPS
        state.productList = action.payload.data?.map(convertImagesToHttps) || [];
      })
      .addCase(fetchAllFilteredProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.productList = [];
      })
      .addCase(fetchProductDetails.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        // ⭐ Convert product detail images to HTTPS
        state.productDetails = convertImagesToHttps(action.payload.data);
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.productDetails = null;
      });
  },
});

export const { setProductDetails } = shoppingProductSlice.actions;

export default shoppingProductSlice.reducer;