import { useState } from "react";
import { Menu, ChevronDown, Sparkles, ShoppingBag } from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetContent } from "../ui/sheet";
import { useSelector, useDispatch } from "react-redux";
import CartSheetButton from "./CartSheetButton";
import WishlistIconWithCount from "./WishlistIconWithCount";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { shoppingViewHeaderMenuItems } from "@/config";
import { Label } from "../ui/label";
import { Link } from "react-router-dom";

function Subheader() {
  const [openMenuSheet, setOpenMenuSheet] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
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
    <div className="bg-white border-t border-gray-200 shadow-md hidden sm:flex items-center justify-between px-6 py-3 mt-14 sm:mt-16 relative overflow-hidden z-10">
     
    
      
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #9333ea 1px, transparent 0)',
          backgroundSize: '30px 30px'
        }}></div>
      </div>

      {/* Left: Menu Sheet with animation */}
      <div className="flex items-center gap-3 relative z-10">
        <Sheet open={openMenuSheet} onOpenChange={setOpenMenuSheet}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpenMenuSheet(true)}
            className="hover:bg-purple-50 hover:scale-110 transition-all duration-300 rounded-full relative group"
          >
            <Menu className="h-5 w-5 text-purple-600 group-hover:rotate-180 transition-transform duration-500" />
          </Button>

          <button
            onClick={() => setOpenMenuSheet(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-300 hover:shadow-md group"
          >
            <ShoppingBag className="h-4 w-4 text-purple-600 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              SHOP BY CATEGORIES
            </span>
            <ChevronDown className="h-4 w-4 text-purple-600 group-hover:translate-y-0.5 transition-transform duration-300" />
          </button>

          <SheetContent side="left" className="w-[280px] bg-gradient-to-br from-white to-purple-50/30">
            <div className="p-4 space-y-6">
              {/* Header with sparkle */}
              <div className="flex items-center gap-2 pb-4 border-b border-purple-200">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Categories
                </h3>
              </div>

              {/* Categories Section */}
              <ul className="space-y-3">
                {shoppingViewHeaderMenuItems.map((menuItem) => (
                  <li
                    key={menuItem.id}
                    className="group pl-3 py-2 cursor-pointer rounded-lg hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 border border-transparent hover:border-purple-200"
                    onClick={() => handleNavigate(menuItem)}
                  >
                    <span className="group-hover:text-purple-600 group-hover:translate-x-1 inline-block transition-all duration-300">
                      {menuItem.label}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Static Links Section */}
              <ul className="space-y-3 text-sm border-t border-purple-200 pt-4">
                <li>
                  <Link 
                    to="/shop/about" 
                    className="block py-2 pl-3 rounded-lg hover:bg-purple-50 hover:text-purple-600 transition-all duration-300"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/shop/contact" 
                    className="block py-2 pl-3 rounded-lg hover:bg-purple-50 hover:text-purple-600 transition-all duration-300"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Middle: Menu Items with modern design */}
      <nav className="hidden lg:flex items-center gap-8 relative z-10">
        {shoppingViewHeaderMenuItems.map((menuItem) => (
          <div
            key={menuItem.id}
            className="relative"
            onMouseEnter={() => setHoveredItem(menuItem.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <Label
              onClick={() => handleNavigate(menuItem)}
              className="text-sm font-semibold cursor-pointer text-gray-700 hover:text-purple-600 transition-all duration-300 relative pb-1"
            >
              {menuItem.label}
              
              {/* Animated underline */}
              <span 
                className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 ${
                  hoveredItem === menuItem.id ? 'w-full' : 'w-0'
                }`}
              />
            </Label>

            {/* Hover glow effect */}
            {hoveredItem === menuItem.id && (
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-100/50 to-pink-100/50 rounded-lg -z-10 animate-pulse" />
            )}
          </div>
        ))}
      </nav>

      {/* Right: Wishlist + Cart with animations */}
      <div className="hidden md:flex items-center gap-4 relative z-10">
        <div className="transform hover:scale-110 transition-all duration-300">
          <WishlistIconWithCount />
        </div>
        <div className="transform hover:scale-110 transition-all duration-300">
          <CartSheetButton />
        </div>
      </div>

      {/* Subtle bottom shadow gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent"></div>

      <style jsx>{`
        @keyframes glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default Subheader;