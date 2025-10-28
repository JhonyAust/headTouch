import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { UserCog, LogOut, Menu, Search, X, Sparkles } from "lucide-react";
import { FaUserCircle } from "react-icons/fa";
import img from "../../assets/logo.png";
import { useState, useEffect } from "react";
import { logoutUser } from "@/store/auth-slice";
import { openLoginPopup } from "../../store/loginRegister-slice";
import { Sheet, SheetContent } from "../ui/sheet";
import { shoppingViewHeaderMenuItems } from "@/config";
import { Button } from "../ui/button";
import { trackSearch } from "../utils/facebookPixel";
function Header() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [openMenuSheet, setOpenMenuSheet] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!location.pathname.startsWith("/shop/search")) {
      setSearchKeyword("");
      setMobileSearchOpen(false);
    }
  }, [location.pathname]);

const handleLogout = () => {
  dispatch(logoutUser()).then(() => {
    navigate("/shop/home");
  });
};

  const handleSearch = () => {
    if (searchKeyword.trim()) {
      trackSearch(searchKeyword.trim());
      navigate(`/shop/search?keyword=${encodeURIComponent(searchKeyword.trim())}`);
      setMobileSearchOpen(false);
    }
  };

  const handleNavigate = (menuItem) => {
    sessionStorage.removeItem("filters");

    const currentFilter =
      menuItem.id !== "home" && menuItem.id !== "products" && menuItem.id !== "search"
        ? { category: [menuItem.id] }
        : null;

    if (currentFilter) {
      sessionStorage.setItem("filters", JSON.stringify(currentFilter));
      setSearchParams(new URLSearchParams(`?category=${menuItem.id}`));
    }

    navigate(menuItem.path);
    setOpenMenuSheet(false);
  };

  return (
    <header 
      className={`fixed top-0 z-40 w-full transition-all duration-300 bg-white`}
    >
      <div className="flex h-16 sm:h-18 items-center justify-between px-4 md:px-6 relative">
       

        {/* Mobile: Menu icon */}
        <div className="md:hidden flex items-center">
          <Sheet open={openMenuSheet} onOpenChange={setOpenMenuSheet}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpenMenuSheet(true)}
              className="hover:bg-purple-50 hover:scale-110 transition-all duration-300 rounded-full relative group"
            >
              <Menu className="h-6 w-6 text-orange-500 group-hover:rotate-180 transition-transform duration-500" />
            </Button>

            <SheetContent side="left" className="w-[280px] bg-gradient-to-br from-white to-purple-50/30">
              <div className="p-4 space-y-6">
                {/* Header with sparkle */}
                <div className="flex items-center gap-2 pb-4 border-b border-purple-200">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <h3 className="font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Browse
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

                {/* About & Contact Section */}
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

                {/* Login/Profile Section */}
                <div className="mt-6 border-t border-purple-200 pt-4">
                  {user ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <div className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-purple-50 transition-all duration-300">
                          <Avatar className="bg-gradient-to-br from-purple-600 to-pink-600 border-2 border-white shadow-md">
                            <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white font-extrabold">
                              {user?.userName[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-semibold text-gray-700">{user?.userName}</span>
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-48">
                        <DropdownMenuLabel>Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate("/shop/account")}>
                          <UserCog className="mr-2 h-4 w-4" />
                          My Account
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => dispatch(logoutUser())}>
                          <LogOut className="mr-2 h-4 w-4" />
                          Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <button
                      onClick={() => dispatch(openLoginPopup())}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 w-full"
                    >
                      <FaUserCircle className="text-purple-600 text-2xl" />
                      <span className="font-semibold text-gray-700">Login</span>
                    </button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Mobile: Centered Logo */}
        <Link 
          to="/shop/home" 
          className="flex md:hidden justify-center flex-1 hover:scale-105 transition-transform duration-300"
        >
          <img src={img} className="h-10 w-32 sm:h-12 sm:w-40" alt="Logo" />
        </Link>

        {/* Mobile: Search icon */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileSearchOpen((prev) => !prev)}
            className="p-2 rounded-full hover:bg-purple-50 hover:scale-110 transition-all duration-300"
          >
            {mobileSearchOpen ? (
              <X className="text-orange-500 w-5 h-5" />
            ) : (
              <Search className="text-orange-500 w-5 h-5" />
            )}
          </button>
        </div>

        {/* Desktop: Full layout */}
        <div className="hidden md:flex items-center justify-between w-full">
          {/* Desktop: Logo on left */}
          <Link 
            to="/shop/home" 
            className="flex items-center hover:scale-105 transition-transform duration-300"
          >
            <img src={img} className="h-12 w-40" alt="Logo" />
          </Link>

          {/* Desktop: Centered search bar */}
          <div className="flex-1 flex justify-center px-8">
            <div className="w-full max-w-2xl relative group">
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search for products..."
                className="w-full border-2 border-gray-200 rounded-full pl-12 pr-4 py-2.5 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-purple-400 transition-all duration-300 bg-white hover:shadow-md"
              />
              <Search
                onClick={handleSearch}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-purple-600 transition-colors duration-300 w-5 h-5"
              />
              
              {/* Animated gradient border on focus */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 opacity-0 group-focus-within:opacity-100 blur-sm -z-10 transition-opacity duration-300"></div>
            </div>
          </div>

          {/* Desktop: Profile/Login on right */}
          <div className="flex items-center gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="bg-gradient-to-br from-purple-600 to-pink-600 cursor-pointer hover:scale-110 transition-transform duration-300 border-2 border-white shadow-lg">
                    <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white font-extrabold">
                      {user?.userName[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" className="w-56">
                  <DropdownMenuLabel>Logged in as {user?.userName}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/shop/account")}>
                    <UserCog className="mr-2 h-4 w-4" />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button 
                onClick={() => dispatch(openLoginPopup())}
                className="p-2 rounded-full hover:bg-purple-50 hover:scale-110 transition-all duration-300"
              >
                <FaUserCircle className="text-purple-600 text-3xl" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Dropdown with Animation */}
      <div 
        className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          mobileSearchOpen ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-4 bg-gradient-to-br from-white via-purple-50/50 to-pink-50/50 border-t border-b border-transparent relative">
          {/* Animated gradient border */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-purple-400/20 animate-gradient"></div>
          
          <div className="relative">
            <div className="relative group">
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search for products..."
                className="w-full border-2 border-purple-200 rounded-full pl-12 pr-12 py-2.5 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-purple-400 transition-all duration-300 bg-white shadow-sm"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
              
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1.5 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm font-semibold"
              >
                Go
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </header>
  );
}

export default Header;