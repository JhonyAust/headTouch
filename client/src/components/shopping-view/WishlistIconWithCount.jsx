import { Heart } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

function WishlistIconWithCount({ iconOnly = false }) {
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useSelector((state) => state.auth);
  const dbWishlistItems = useSelector((state) => state.wishlist.items);
  const localWishlistItems = useSelector((state) => state.localWishlist.items);

  const wishlistCount = user ? dbWishlistItems.length : localWishlistItems.length;

  const isActive = location.pathname.includes("/shop/wishlist");

  return (
    <button
      onClick={() => navigate("/shop/wishlist")}
      className={`relative flex flex-col items-center text-xs ${
        isActive ? "text-blue-500" : "text-black"
      }`}
    >
      {/* Icon */}
      <Heart className="w-6 h-6 text-current" />

      {/* Count badge - only show when count is greater than 0 */}
      {wishlistCount > 0 && (
        <span className="absolute -top-1 -right-2 text-[10px] bg-red-500 text-white rounded-full px-1.5 min-w-[18px] text-center">
          {wishlistCount}
        </span>
      )}
    </button>
  );
}

export default WishlistIconWithCount;