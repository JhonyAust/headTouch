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
function Subheader() {
  const [openMenuSheet, setOpenMenuSheet] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
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
    <div className="bg-gray-100 shadow flex items-center justify-between px-4 py-2 mt-16 sm:mt-20">
      {/* Left: Menu Sheet */}
      <Sheet open={openMenuSheet} onOpenChange={setOpenMenuSheet}>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpenMenuSheet(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>
        <SheetContent side="left">
          <div className="p-4 space-y-4">
            <ul className="space-y-2">
              <li className="font-bold">Shop by Category</li>
              <li className="pl-2 cursor-pointer">Men</li>
              <li className="pl-2 cursor-pointer">Women</li>
              <li className="pl-2 cursor-pointer">Footwear</li>
              <li className="pl-2 cursor-pointer">Kids</li>
              <li className="font-bold mt-2">Products</li>
              <li className="pl-2 cursor-pointer">Account / Sign In</li>
              <li className="pl-2 cursor-pointer">Settings</li>
              <li className="pl-2 cursor-pointer">Contact</li>
            </ul>
          </div>
        </SheetContent>
      </Sheet>

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
