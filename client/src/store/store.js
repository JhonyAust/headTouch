import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import adminProductsSlice from "./admin/products-slice";
import adminUserSlice from "./admin/user-slice";
import adminOrderSlice from "./admin/order-slice";
import loginRegisterSlice from "./loginRegister-slice";
import shopProductsSlice from "./shop/products-slice";
import shopCartSlice from "./shop/cart-slice";
import shopAddressSlice from "./shop/address-slice";
import shopOrderSlice from "./shop/order-slice";
import shopSearchSlice from "./shop/search-slice";
import shopReviewSlice from "./shop/review-slice";
import commonFeatureSlice from "./common-slice";
import localCartSlice from "./shop/cart-slice-local";
import wishlistSlice from "./shop/wishlist-slice"; // ✅ NEW
import localWishlistSlice from "./shop/wishlist-slice-local"; // ✅ NEW
import adminCouponSlice from "./admin/coupon-slice";
import couponSlice from "./shop/shop-coupon-slice";
const store = configureStore({
    reducer: {
        auth: authReducer,

        adminProducts: adminProductsSlice,
        adminOrder: adminOrderSlice,
        adminUser: adminUserSlice,
        adminCoupon: adminCouponSlice,
        loginRegister: loginRegisterSlice,

        shopProducts: shopProductsSlice,
        shopCart: shopCartSlice,
        shopAddress: shopAddressSlice,
        shopOrder: shopOrderSlice,
        shopSearch: shopSearchSlice,
        shopReview: shopReviewSlice,
        coupon: couponSlice,
        commonFeature: commonFeatureSlice,
        localcart: localCartSlice,

        wishlist: wishlistSlice,
        localWishlist: localWishlistSlice,
    },
});

export default store;