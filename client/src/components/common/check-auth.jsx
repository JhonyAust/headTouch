import { useLocation, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { openLoginPopup } from "../../store/loginRegister-slice";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const { showLoginPopup } = useSelector((state) => state.loginRegister);
  const { isLoading } = useSelector((state) => state.auth);

  const protectedShopPaths = [
    "/shop/account",
    "/shop/checkout",
    "/shop/payment-success",
  ];

  // Wait for auth check to complete
  if (isLoading) {
    return null;
  }

  // If authenticated, render the protected page
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // If not authenticated and trying to access protected route
  if (!isAuthenticated && protectedShopPaths.includes(location.pathname)) {
    // Open popup only if it's not already open
    if (!showLoginPopup) {
      dispatch(openLoginPopup());
    }
    return null;
  }

  // For other pages, redirect to unauth page
  return <Navigate to="/unauth-page" />;
}

export default CheckAuth;