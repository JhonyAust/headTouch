import { Route, Routes ,useLocation} from "react-router-dom";
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import AdminLayout from "./components/admin-view/layout";
import AdminProducts from "./pages/admin-view/products";
import AdminOrders from "./pages/admin-view/orders";
import AdminUsers from "./pages/admin-view/users";

import AdminFeatures from "./pages/admin-view/features";
import ShoppingLayout from "./components/shopping-view/layout";
import NotFound from "./pages/not-found";
import ShoppingHome from "./pages/shopping-view/home";
import ShoppingListing from "./pages/shopping-view/listing";
import ShoppingCheckout from "./pages/shopping-view/checkout";
import ShoppingAccount from "./pages/shopping-view/account";
import CheckAuth from "./components/common/check-auth";
import UnauthPage from "./pages/unauth-page";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/auth-slice";
import { Skeleton } from "@/components/ui/skeleton";
import PaypalReturnPage from "./pages/shopping-view/paypal-return";
import PaymentSuccessPage from "./pages/shopping-view/payment-success";
import SearchProducts from "./pages/shopping-view/search";
import MyFooter from "./components/common/MyFooter";
import ProductDetails from "./pages/shopping-view/product-details";
import LoginRegisterPopup from "./components/auth/LoginRegisterPopup";
import { useNavigate } from "react-router-dom";
import OrderConfirmation from "./pages/shopping-view/OrderConfirmation";
import AdminDashboard from "./pages/admin-view/dashboard";
import AdminOrderDetailsPage from "./pages/admin-view/orderdetails";
import Wishlist from "./pages/shopping-view/WishList";
import BottomNav from "./components/common/BottomNav";
import AppInit from "./components/shopping-view/AppInit";
import { fetchCartItems } from "./store/shop/cart-slice";
import LoadingScreen from "./components/common/LoadingScreen";
import AboutUs from "./pages/shopping-view/about-us";
import ContactUs from "./pages/shopping-view/contact-us";
import AdminCouponsView from "./pages/admin-view/admin-coupon-view";
import TermsAndConditions from "./pages/shopping-view/terms";

function App() {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  
  const route = useLocation();
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
  const navigate = useNavigate();
  const location = useLocation();
useEffect(() => {
  const userId = user?._id || user?.id;

  if (userId) {
    console.log("📦 Dispatching fetchCartItems with userId:", userId);
    dispatch(fetchCartItems(userId));
  } else {
    console.log("⚠️ No user ID yet. Skipping fetchCartItems.");
  }
}, [user, dispatch]);


  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === "admin" && !location.pathname.startsWith("/admin")) {
        navigate("/admin/dashboard");
      }
    }
  }, [isAuthenticated, user, navigate, location.pathname]);

  // if (isLoading) return <LoadingScreen />; 

  console.log(isLoading, user);

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <AppInit />
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/shop/home" replace />}
        />

        
        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="features" element={<AdminFeatures />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="coupons" element={<AdminCouponsView />} />
          <Route path="features" element={<AdminFeatures />} />
          <Route path="orders/:orderId" element={<AdminOrderDetailsPage />} />
        </Route>
      {/* ✅ Shopping routes (public + protected) */}
        <Route path="/shop" element={<ShoppingLayout />}>
          <Route path="home" element={<ShoppingHome />} />
          <Route path="listing" element={<ShoppingListing />} />
          <Route path="product/:category/:slug" element={<ProductDetails />} />
          <Route path="search" element={<SearchProducts />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="terms" element={<TermsAndConditions />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="contact" element={<ContactUs />} />



          {/* ✅ Protected routes wrapped with CheckAuth */}
          <Route path="checkout" element={
            
              <ShoppingCheckout />
           
          } />
          <Route path="account" element={
            <CheckAuth isAuthenticated={isAuthenticated}>
              <ShoppingAccount />
            </CheckAuth>
          } />
          <Route path="order-confirmation" element={
            
              <OrderConfirmation/>
            
          } />
          <Route path="payment-success" element={
            <CheckAuth isAuthenticated={isAuthenticated}>
              <PaymentSuccessPage />
            </CheckAuth>
          } />
        </Route>
        <Route path="/unauth-page" element={<UnauthPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {route.pathname?.startsWith("/shop") && (
        <>
          <div className="mt-[150px]">
            <MyFooter />
          </div>
          <BottomNav />
        </>
      )}
      <LoginRegisterPopup />

    </div>
  );
}

export default App;
