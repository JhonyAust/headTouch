import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaHome, FaShoppingBag, FaShoppingCart, FaUser } from "react-icons/fa";
import CartSheetButton from "../shopping-view/CartSheetButton";
import WishlistIconWithCount from "../shopping-view/WishlistIconWithCount";
import { openLoginPopup } from "../../store/loginRegister-slice";

const navItems = [
  { to: "/shop/home", icon: <FaHome />, label: "Home", gradientFrom: "#10b981", gradientTo: "#06b6d4" }, // Emerald → Cyan
  { to: "/shop/listing", icon: <FaShoppingBag />, label: "Shop", gradientFrom: "#3b82f6", gradientTo: "#8b5cf6" }, // Blue → Purple
  { type: "cart", icon: <FaShoppingCart />, label: "Cart", gradientFrom: "#7c3aed", gradientTo: "#ec4899" }, // Violet → Pink
  { type: "wishlist", label: "Wishlist", gradientFrom: "#f43f5e", gradientTo: "#ef4444" }, // Rose → Red
  { type: "account", icon: <FaUser />, label: "Account", gradientFrom: "#f97316", gradientTo: "#eab308" }, // Orange → Yellow
];

const BottomNav = () => {
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowNav(false);
      } else {
        setShowNav(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 sm:hidden transition-all duration-300 ease-in-out ${
        showNav ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="bg-white/80 backdrop-blur-xl border-t border-gray-200/50">
        <div className="flex justify-around items-center py-3 px-2">
          {navItems.map(({ to, icon, label, type, gradientFrom, gradientTo }) => {
            // 🛒 Cart
            if (type === "cart") {
              return (
                <div
                  key="cart"
                  className="group relative flex flex-col items-center transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                >
                  <div className="relative text-gray-600 hover:text-transparent hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:bg-clip-text transition-colors duration-300">
                    <CartSheetButton icon={icon} label={label} />
                  </div>
                </div>
              );
            }

            // ❤️ Wishlist
            if (type === "wishlist") {
              return (
                <div
                  key="wishlist"
                  className="group relative flex flex-col items-center transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                >
                  <div className="relative text-gray-600 hover:text-transparent hover:bg-gradient-to-r hover:from-rose-500 hover:to-red-500 hover:bg-clip-text transition-colors duration-300">
                    <WishlistIconWithCount />
                  </div>
                </div>
              );
            }

            // 👤 Account
            if (type === "account") {
              return (
                <button
                  key="account"
                  onClick={() => {
                    if (user) navigate("/shop/account");
                    else dispatch(openLoginPopup());
                  }}
                  className="group relative flex flex-col items-center text-xs transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                >
                  <div className="text-2xl mb-1 text-gray-600  group-hover:bg-gradient-to-r group-hover:from-amber-500 group-hover:to-yellow-400 group-hover:bg-clip-text transition-all duration-300">
                    {icon}
                  </div>
                  <div className="group-hover:text-amber-500">{label}</div>
                  <div className="w-1.5 h-1.5 mt-1 rounded-full bg-gray-400 opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300" />
                </button>
              );
            }

            // 🏠 Normal routes
            return (
              <NavLink
                key={to}
                to={to}
                className="group relative flex flex-col items-center text-xs transition-all duration-300 hover:scale-110 hover:-translate-y-1"
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={`relative text-2xl mb-1 transition-all duration-300 ${
                        isActive ? "" : "text-gray-600"
                      }`}
                      style={
                        isActive
                          ? {
                              background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                            }
                          : {}
                      }
                    >
                      {icon}
                    </div>

                    <div
                      className={`relative transition-all duration-300 ${
                        isActive ? "font-semibold" : "text-gray-600 font-medium"
                      }`}
                      style={
                        isActive
                          ? {
                              background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                            }
                          : {}
                      }
                    >
                      {label}
                    </div>

                    <div
                      className={`w-1.5 h-1.5 mt-1 rounded-full transition-all duration-300 ${
                        isActive
                          ? "opacity-100 scale-100"
                          : "bg-gray-400 opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100"
                      }`}
                      style={
                        isActive
                          ? {
                              background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
                            }
                          : {}
                      }
                    />
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNav;
