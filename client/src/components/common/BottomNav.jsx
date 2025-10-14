import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaShoppingBag, FaShoppingCart, FaUser } from "react-icons/fa";
import CartSheetButton from "../shopping-view/CartSheetButton";
import WishlistIconWithCount from "../shopping-view/WishlistIconWithCount";

const navItems = [
  { to: "/shop/home", icon: <FaHome />, label: "Home", gradientFrom: "#10b981", gradientTo: "#06b6d4" }, // Emerald to Cyan
  { to: "/shop/listing", icon: <FaShoppingBag />, label: "Shop", gradientFrom: "#3b82f6", gradientTo: "#8b5cf6" }, // Blue to Purple
  { type: "cart", icon: <FaShoppingCart />, label: "Cart", gradientFrom: "#7c3aed", gradientTo: "#ec4899" }, // Purple-700 to Pink-700
  { type: "wishlist",label: "Wishlist", gradientFrom: "#f43f5e", gradientTo: "#ef4444" }, // Rose to Red
  { to: "/shop/account", icon: <FaUser />, label: "Account", gradientFrom: "#f97316", gradientTo: "#eab308" }, // Orange to Yellow
];

const BottomNav = () => {
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down
        setShowNav(false);
      } else {
        // Scrolling up
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
      {/* Glassmorphism backdrop with blur */}
      <div className="bg-white/80 backdrop-blur-xl border-t border-gray-200/50">
        {/* Navigation items container */}
        <div className="flex justify-around items-center py-3 px-2">
          {navItems.map(({ to, icon, label, type, gradientFrom, gradientTo }) => {
            if (type === "cart") {
              return (
                <div
                  key="cart"
                  className="group relative flex flex-col items-center transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                >
                  <div className="relative text-gray-600 hover:text-purple-500 transition-colors duration-300">
                    <CartSheetButton icon={icon} label={label} />
                  </div>
                </div>
              );
            }

            if (type === "wishlist") {
              return (
                <div
                  key="wishlist"
                  className="group relative flex flex-col items-center transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                >
                  <div className="relative text-gray-600 hover:text-rose-500 transition-colors duration-300">
                    <WishlistIconWithCount />
                  </div>
                </div>
              );
            }

            return (
              <NavLink
                key={to}
                to={to}
                className="group relative flex flex-col items-center text-xs transition-all duration-300 hover:scale-110 hover:-translate-y-1"
              >
                {({ isActive }) => (
                  <>
                    {/* Icon with gradient color when active */}
                    <div 
                      className={`relative text-2xl mb-1 transition-all duration-300 ${
                        isActive ? "" : "text-gray-600"
                      }`}
                      style={isActive ? {
                        background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      } : {}}
                    >
                      {icon}
                    </div>

                    {/* Label with gradient color when active */}
                    <div 
                      className={`relative transition-all duration-300 ${
                        isActive ? "font-semibold" : "text-gray-600 font-medium"
                      }`}
                      style={isActive ? {
                        background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      } : {}}
                    >
                      {label}
                    </div>

                    {/* Active indicator dot with gradient */}
                    <div 
                      className={`w-1.5 h-1.5 mt-1 rounded-full transition-all duration-300 ${
                        isActive 
                          ? "opacity-100 scale-100" 
                          : "bg-gray-400 opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100"
                      }`}
                      style={isActive ? {
                        background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`
                      } : {}}
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