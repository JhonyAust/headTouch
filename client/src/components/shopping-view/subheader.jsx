import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetContent } from "../ui/sheet";
import { useSelector, useDispatch } from "react-redux";
import CartSheetButton from "./CartSheetButton";
import WishlistIconWithCount from "./WishlistIconWithCount";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { shoppingViewHeaderMenuItems } from "@/config";
import { Label } from "../ui/label";

function Subheader() {
  const [openMenuSheet, setOpenMenuSheet] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useSelector((state) => state.auth);
  const dbWishlistItems = useSelector((state) => state.wishlist.items);
  const localWishlistItems = useSelector((state) => state.localWishlist.items);
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

    if (currentFilter) {
      sessionStorage.setItem("filters", JSON.stringify(currentFilter));
      setSearchParams(new URLSearchParams(`?category=${getCurrentMenuItem.id}`));
    }

    navigate(getCurrentMenuItem.path);
    setOpenMenuSheet(false);
  }

  return (
    <div className="bg-white border-t border-b border-gray-200 shadow hidden sm:flex items-center justify-between px-4 py-2 mt-14 sm:mt-16">
      {/* Left: Menu Sheet */}
      <div className="flex items-center gap-2">
        <Sheet open={openMenuSheet} onOpenChange={setOpenMenuSheet}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpenMenuSheet(true)}
            className="hover:bg-transparent focus:bg-transparent active:bg-transparent"
          >
            <Menu className="h-5 w-5 text-ht_secondary" />
          </Button>

          <span
            className="text-sm font-bold text-ht_secondary cursor-pointer hover:text-orange-600"
            onClick={() => setOpenMenuSheet(true)}
          >
            SHOP BY CATEGORIES
          </span>

          <SheetContent side="left">
            <div className="p-4 space-y-4">
              <ul className="space-y-4">
                <li className="font-bold">Shop by Category</li>
                {shoppingViewHeaderMenuItems.map((menuItem) => (
                  <li
                    key={menuItem.id}
                    className="pl-2 cursor-pointer hover:text-orange-600"
                    onClick={() => handleNavigate(menuItem)}
                  >
                    {menuItem.label}
                  </li>
                ))}
              </ul>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Middle: Menu Items */}
      <nav className="hidden lg:flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
        {shoppingViewHeaderMenuItems.map((menuItem) => (
          <Label
            onClick={() => handleNavigate(menuItem)}
            className="text-sm font-medium cursor-pointer 
              text-ht_secondary hover:text-ht_secondary_hover  
              lg:text-ht_secondary lg:hover:text-orange-600
              hover:underline decoration-orange-600 underline-offset-8 transition-all"
            key={menuItem.id}
          >
            {menuItem.label}
          </Label>
        ))}
      </nav>

      {/* Right: Wishlist + Cart */}
      <div className="hidden md:flex items-center gap-4">
        <WishlistIconWithCount />
        <CartSheetButton />
      </div>
    </div>
  );
}

export default Subheader;
