import { Link, useNavigate, useLocation } from "react-router-dom";
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
import { UserCog, LogOut } from "lucide-react";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import img from "../../assets/logo.png";
import { useState, useEffect } from "react";
import { logoutUser } from "@/store/auth-slice";
import { openLoginPopup } from "../../store/loginRegister-slice";

function Header() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchKeyword, setSearchKeyword] = useState("");
  const location = useLocation();

  function handleLogout() {
    dispatch(logoutUser());
    window.location.reload();
  }

  function handleSearch() {
    if (searchKeyword.trim()) {
      navigate(`/shop/search?keyword=${encodeURIComponent(searchKeyword.trim())}`);
    }
  }

  useEffect(() => {
    if (!location.pathname.startsWith("/shop/search")) {
      setSearchKeyword("");
    }
  }, [location.pathname]);

  return (
    <header className="fixed top-0  z-40 w-full bg-ht_secondary">
      <div className="flex h-16 sm:h-20 items-center justify-between px-4 md:px-6">
        {/* Left: Logo */}
        <Link to="/shop/home" className="flex items-center gap-2 mb-4">
          <img src={img} className="h-10 w-32 sm:h-12 sm:w-48  mt-4" />
        </Link>

        {/* Middle: Search Bar */}
  
      <div className="hidden sm:flex flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            placeholder="Search HeadTouch"
            className="w-full border rounded pl-10 pr-4 py-2 focus:outline-none"
          />
          <FaSearch
            onClick={handleSearch}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
          />
        </div>
      </div>


        {/* Right: Account */}
        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="bg-black sm:bg-white">
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
      </div>
    </header>
  );
}

export default Header;
