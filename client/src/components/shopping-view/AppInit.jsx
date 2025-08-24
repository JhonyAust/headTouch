import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchWishlist } from "@/store/shop/wishlist-slice";

function AppInit() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user && user?.id) {
      dispatch(fetchWishlist(user.id));
    }
  }, [user, dispatch]);

  return null;
}

export default AppInit;
