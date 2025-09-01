import { useState, useEffect } from "react";
import { Menu, ShoppingCartIcon, Heart} from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetContent } from "../ui/sheet";
import { useSelector, useDispatch } from "react-redux";
import CartSheetButton from "./CartSheetButton";
import UserCartWrapper from "./cart-wrapper";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { shoppingViewHeaderMenuItems } from "@/config";
import { Label } from "../ui/label";
import { openLoginPopup } from "../../store/loginRegister-slice";
import { getLocalCart } from "../utils/localCartUtils";
import WishlistIconWithCount from "./WishlistIconWithCount";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { UserCog, LogOut } from "lucide-react";
import { FaUserCircle } from "react-icons/fa";
import { logoutUser } from "@/store/auth-slice";


function Subheader() {
  const [openMenuSheet, setOpenMenuSheet] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useSelector((state) => state.auth);
  const dbWishlistItems = useSelector((state) => state.wishlist.items);
  const localWishlistItems = useSelector((state) => state.localWishlist.items);

  // Determine correct count
  const wishlistCount = user ? dbWishlistItems.length : localWishlistItems.length;





  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? {
            category: [getCurrentMenuItem.id],
          }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    location.pathname.includes("listing") && currentFilter !== null
      ? setSearchParams(
          new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
        )
      : navigate(getCurrentMenuItem.path);
  }

  return (
    <div className="bg-gray-100 shadow hidden sm:flex items-center justify-between px-4 py-2 mt-14 sm:mt-16">
      {/* Left: Menu Sheet */}
      <div></div>

      {/* Middle: shoppingViewHeaderMenuItems */}
      <nav className="hidden lg:flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
        {shoppingViewHeaderMenuItems.map((menuItem) => (
          <Label
            onClick={() => handleNavigate(menuItem)}
            className="text-sm font-medium cursor-pointer 
              text-gray-800 hover:text-gray-600   
              lg:text-black lg:hover:text-orange-600
              sm:text-red-600 sm:hover:text-red-800 
              hover:underline decoration-orange-600 underline-offset-8 sm:decoration-orange-600 
              transition-all"
            key={menuItem.id}
          >
            {menuItem.label}
          </Label>
        ))}
      </nav>

     <div className="hidden md:flex items-center gap-4">
        {/* ❤️ Wishlist Icon */}
        <WishlistIconWithCount/>

        {/* 🛒 Cart Icon */}
        <CartSheetButton />
      </div>


    </div>
  );
}

export default Subheader;
