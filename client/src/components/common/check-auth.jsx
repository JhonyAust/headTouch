import { useLocation, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { openLoginPopup } from "../../store/loginRegister-slice";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();
  const dispatch = useDispatch();

  const protectedShopPaths = [
    "/shop/account",
    "/shop/checkout",
    "/shop/paypal-return",
    "/shop/payment-success",
  ];

 

  // ✅ For certain shop pages: open login popup if unauthenticated
  if (!isAuthenticated && protectedShopPaths.includes(location.pathname)) {
    dispatch(openLoginPopup());
    return null;
  }

  // ✅ If not authenticated for other pages → navigate to unauth-page
  if (!isAuthenticated) {
    return <Navigate to="/unauth-page" />;
  }

  // ✅ Default: render children
  return <>{children}</>;
}

export default CheckAuth;
