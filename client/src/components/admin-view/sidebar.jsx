import {
  BadgeCheck,
  ChartNoAxesCombined,
  LayoutDashboard,
  ShoppingBasket,
  Users,
  ImageIcon,
  Tag,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { Fragment } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard />,
    gradient: "from-blue-600 to-cyan-600",
    bgColor: "bg-blue-50",
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <ShoppingBasket />,
    gradient: "from-purple-600 to-pink-600",
    bgColor: "bg-purple-50",
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: <BadgeCheck />,
    gradient: "from-green-600 to-emerald-600",
    bgColor: "bg-green-50",
  },
  {
    id: "users",
    label: "Users",
    path: "/admin/users",
    icon: <Users />,
    gradient: "from-orange-600 to-red-600",
    bgColor: "bg-orange-50",
  },
  {
    id: "features",
    label: "Features",
    path: "/admin/features",
    icon: <ImageIcon />,
    gradient: "from-indigo-600 to-purple-600",
    bgColor: "bg-indigo-50",
  },
  {
    id: "coupons",
    label: "Coupons",
    path: "/admin/coupons",
    icon: <Tag />,
    gradient: "from-pink-600 to-rose-600",
    bgColor: "bg-pink-50",
  },
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="mt-8 flex-col flex gap-2 z-[100] ">
      {adminSidebarMenuItems.map((menuItem, index) => {
        const isActive = location.pathname === menuItem.path;
        
        return (
          <div
            key={menuItem.id}
            onClick={() => {
              navigate(menuItem.path);
              setOpen ? setOpen(false) : null;
            }}
            className={`group relative flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 overflow-hidden animate-slide-in ${
              isActive
                ? `bg-gradient-to-r ${menuItem.gradient} text-white shadow-lg scale-105`
                : 'text-gray-700 hover:bg-gray-50 hover:scale-105'
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Animated background on hover */}
            {!isActive && (
              <div className={`absolute inset-0 bg-gradient-to-r ${menuItem.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
            )}

            {/* Glow effect for active item */}
            {isActive && (
              <div className={`absolute inset-0 bg-gradient-to-r ${menuItem.gradient} blur-xl opacity-50 -z-10`}></div>
            )}

            {/* Icon container */}
            <div className={`relative z-10 p-2 rounded-lg transition-all duration-300 ${
              isActive 
                ? 'bg-white/20 scale-110' 
                : `${menuItem.bgColor} group-hover:scale-110 group-hover:rotate-6`
            }`}>
              {menuItem.icon}
            </div>

            {/* Label */}
            <span className="relative z-10 font-semibold text-base flex-1">
              {menuItem.label}
            </span>

            {/* Arrow indicator */}
            <ChevronRight 
              className={`relative z-10 w-5 h-5 transition-all duration-300 ${
                isActive 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
              }`}
            />

            {/* Active indicator line */}
            {isActive && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full animate-expand"></div>
            )}

            {/* Shine effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>
          </div>
        );
      })}
    </nav>
  );
}

function AdminSideBar({ open, setOpen }) {
  const navigate = useNavigate();

  return (
    <Fragment className="z-10">
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 z-[110] bg-gradient-to-br from-white via-purple-50/30 to-white">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b border-purple-100 pb-6">
              <SheetTitle className="flex items-center gap-3 mt-5">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur-md opacity-50"></div>
                  <div className="relative p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
                    <ChartNoAxesCombined className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-black bg-gradient-to-r from-purple-900 to-pink-600 bg-clip-text text-transparent">
                    Admin Panel
                  </h1>
                  <p className="text-xs text-gray-500 font-normal">Manage your store</p>
                </div>
              </SheetTitle>
            </SheetHeader>
            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden w-72 flex-col border-r border-gray-200 bg-gradient-to-br from-white via-purple-50/30 to-white p-6 lg:flex shadow-xl">
        {/* Logo Section */}
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="group flex cursor-pointer items-center gap-3 mb-2 p-3 rounded-xl hover:bg-white/80 transition-all duration-300"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <ChartNoAxesCombined className="w-7 h-7 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-purple-900 to-pink-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-pink-400 transition-all duration-300">
              Admin Panel
            </h1>
            <p className="text-xs text-gray-500">Manage your store</p>
          </div>
        </div>

        {/* Welcome Badge */}
        <div className="mb-4 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl border border-purple-200 animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
            <span className="text-xs font-bold text-purple-600">QUICK ACCESS</span>
          </div>
          <p className="text-xs text-gray-600">
            Manage all aspects of your store from one place
          </p>
        </div>

        <MenuItems />

        {/* Bottom Decorative Element */}
        <div className="mt-auto pt-6">
          <div className="p-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl text-white relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <div className="relative z-10">
              <p className="text-xs font-semibold mb-1">Need Help?</p>
              <p className="text-xs opacity-90">Contact support</p>
            </div>
          </div>
        </div>
      </aside>

      <style jsx>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes expand {
          from {
            transform: scaleY(0);
          }
          to {
            transform: scaleY(1);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-in {
          animation: slide-in 0.5s ease-out forwards;
          opacity: 0;
        }

        .animate-expand {
          animation: expand 0.3s ease-out forwards;
          transform-origin: top;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </Fragment>
  );
}

export default AdminSideBar;