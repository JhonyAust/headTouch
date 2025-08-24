import { NavLink } from "react-router-dom";
import { FaHome, FaShoppingCart, FaHeart, FaUser } from "react-icons/fa";
import CartSheetButton from "../shopping-view/CartSheetButton";
import WishlistIconWithCount from "../shopping-view/WishlistIconWithCount";

const navItems = [
  { to: "/shop/listing", icon: <FaHome />, label: "Shop" },
  { type: "cart", icon: <FaShoppingCart />, label: "Cart" }, 
  { type: "wishlist" },
  { to: "/shop/account", icon: <FaUser />, label: "Account" },
];


const BottomNav = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow z-50 flex justify-around items-center py-4 sm:hidden">
     {navItems.map(({ to, icon, label, type }) => {
        if (type === "cart") {
          return <CartSheetButton key="cart" icon={icon} label={label} />;
        }

        if (type === "wishlist") {
          return <WishlistIconWithCount key="wishlist" />;
        }

        return (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center text-xs ${isActive ? "text-blue-500" : "text-gray-500"}`
            }
          >
            <div className="text-lg">{icon}</div>
            <div>{label}</div>
          </NavLink>
        );
      })}

    </div>
  );
};


export default BottomNav;
