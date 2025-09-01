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
import { UserCog, LogOut, Menu } from "lucide-react";
import { FaSearch } from "react-icons/fa";
import img from "../../assets/logo.png";
import { useState, useEffect } from "react";
import { logoutUser } from "@/store/auth-slice";
import { openLoginPopup } from "../../store/loginRegister-slice";
import { Sheet, SheetContent } from "../ui/sheet";
import { shoppingViewHeaderMenuItems } from "@/config";
import { FaUserCircle } from "react-icons/fa";
import { Button } from "../ui/button";

function Header() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [openMenuSheet, setOpenMenuSheet] = useState(false);
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!location.pathname.startsWith("/shop/search")) {
      setSearchKeyword("");
      setMobileSearchOpen(false);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logoutUser());
    window.location.reload();
  };

  const handleSearch = () => {
    if (searchKeyword.trim()) {
      navigate(`/shop/search?keyword=${encodeURIComponent(searchKeyword.trim())}`);
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
    <header className="fixed top-0 z-40 w-full bg-ht_secondary shadow">
      <div className="flex h-14 sm:h-16 items-center justify-between px-4 md:px-6">
        {/* Left: Logo */}
        <Link to="/shop/home" className="flex items-center gap-2">
          <img src={img} className="h-10 w-32 sm:h-12 sm:w-40" />
        </Link>

        {/* Middle: Desktop Search */}
        <div className="flex-1 hidden md:flex justify-center ">
          <div className="w-full max-w-md relative">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search HeadTouch"
              className="w-full border rounded pl-10 pr-4 py-1 focus:outline-none"
            />
            <FaSearch
              onClick={handleSearch}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Right: Desktop Profile + Mobile Icons */}
        <div className="flex items-center gap-3">
          {/* Desktop: Profile */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="bg-black sm:bg-white cursor-pointer">
                    <AvatarFallback className="bg-black sm:bg-white text-white sm:text-black font-extrabold">
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
              <button onClick={() => dispatch(openLoginPopup())}>
                <FaUserCircle className="text-white text-2xl" />
              </button>
            )}
          </div>

          {/* Mobile: Search icon instead of profile */}
          <div className=" flex items-center gap-3">
            <FaSearch
              className="text-white md:hidden text-xl cursor-pointer"
              onClick={() => setMobileSearchOpen((prev) => !prev)}
            />

            {/* Mobile Menu Sheet */}
            <Sheet open={openMenuSheet} onOpenChange={setOpenMenuSheet}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpenMenuSheet(true)}
                className="hover:bg-transparent focus:bg-transparent active:bg-transparent"
              >
                <Menu className="h-6 w-6 text-white" />
              </Button>

              <SheetContent side="right">
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

                  {/* Login/Profile */}
                  <div className="mt-6 border-t pt-4">
                    {user ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <div className="flex items-center gap-2 cursor-pointer">
                            <Avatar className="bg-black">
                              <AvatarFallback className="bg-black text-white font-extrabold">
                                {user?.userName[0].toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-semibold">{user?.userName}</span>
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
                        className="flex items-center gap-2 text-gray-700 hover:text-orange-600"
                      >
                        <FaUserCircle className="text-2xl" />
                        <span>Login</span>
                      </button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Mobile search input */}
      {mobileSearchOpen && (
        <div className="md:hidden px-4 py-2 bg-white">
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search HeadTouch"
            className="w-full border rounded pl-10 pr-4 py-1 focus:outline-none"
          />
        </div>
      )}
    </header>
  );
}

export default Header;
