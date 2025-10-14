import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersForAdmin } from "@/store/admin/order-slice";
import { fetchAllProducts } from "@/store/admin/products-slice";
import {
  UsersIcon,
  PackageCheck,
  ShoppingCart,
  PackageSearch,
  Truck,
  TrendingUp,
  TrendingDown,
  Sparkles,
} from "lucide-react";
import {
  getAllUsersForAdmin,
  fetchUserStats,
} from "../../store/admin/user-slice";

function StatCard({ icon: Icon, title, value, footerText, iconBg, gradient, index }) {
  const displayText = footerText ? `${footerText}%` : "No data";
  const isPositive = footerText && parseFloat(footerText) >= 0;
  const displayColor = footerText
    ? isPositive
      ? "text-green-600"
      : "text-red-600"
    : "text-gray-400";

  return (
    <div 
      className="group relative rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-purple-200 hover:-translate-y-2"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Animated gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
      
      {/* Decorative corner element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100/50 to-pink-100/50 rounded-full blur-3xl -translate-y-16 translate-x-16 group-hover:translate-x-12 group-hover:-translate-y-12 transition-transform duration-700"></div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className={`p-3 rounded-xl ${iconBg} group-hover:scale-110 transition-transform duration-300 shadow-md`}>
            <Icon className="w-6 h-6" strokeWidth={2} />
          </div>
          <div className="text-right">
            <h4 className="text-sm font-semibold text-gray-600 mb-1">{title}</h4>
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
              isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
            }`}>
              {footerText && (
                <>
                  {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {displayText}
                </>
              )}
              {!footerText && <span className="text-gray-400">--</span>}
            </div>
          </div>
        </div>

        {/* Value */}
        <div className="mb-4">
          <div className={`text-4xl font-black bg-gradient-to-r ${gradient} bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300 inline-block`}>
            {value.toLocaleString()}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-xs text-gray-500 font-medium">vs last week</span>
          <div className={`h-1 w-20 rounded-full bg-gradient-to-r ${gradient} opacity-60 group-hover:opacity-100 transition-opacity duration-300`}></div>
        </div>
      </div>

      {/* Hover shine effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </div>
    </div>
  );
}

const statsConfig = [
  {
    icon: UsersIcon,
    title: "Total Users",
    key: "totalUsers",
    iconBg: "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-900",
    gradient: "from-gray-700 to-gray-900",
  },
  {
    icon: PackageCheck,
    title: "Total Products",
    key: "totalProducts",
    iconBg: "bg-gradient-to-br from-blue-100 to-blue-200 text-blue-900",
    gradient: "from-blue-600 to-blue-800",
  },
  {
    icon: ShoppingCart,
    title: "Total Orders",
    key: "totalOrders",
    iconBg: "bg-gradient-to-br from-yellow-100 to-yellow-200 text-yellow-900",
    gradient: "from-yellow-600 to-orange-600",
  },
  {
    icon: PackageSearch,
    title: "New Orders",
    key: "newOrders",
    iconBg: "bg-gradient-to-br from-purple-100 to-purple-200 text-purple-900",
    gradient: "from-purple-600 to-pink-600",
  },
  {
    icon: Truck,
    title: "Delivered Orders",
    key: "deliveredOrders",
    iconBg: "bg-gradient-to-br from-green-100 to-green-200 text-green-900",
    gradient: "from-green-600 to-emerald-600",
  },
];

function AdminDashboard() {
  const dispatch = useDispatch();

  const { orderList } = useSelector((state) => state.adminOrder);
  const { users, userStats } = useSelector((state) => state.adminUser);
  const { productList } = useSelector((state) => state.adminProducts);

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
    dispatch(fetchAllProducts());
    dispatch(getAllUsersForAdmin());
    dispatch(fetchUserStats());
  }, [dispatch]);

  const totalUsers = users?.length || 0;
  const totalProducts = productList?.length || 0;
  const totalOrders = orderList?.length || 0;
  const newOrders =
    orderList?.filter((o) => o.orderStatus === "pending").length || 0;
  const deliveredOrders =
    orderList?.filter((o) => o.orderStatus === "delivered").length || 0;

  const dataMap = {
    totalUsers,
    totalProducts,
    totalOrders,
    newOrders,
    deliveredOrders,
  };

  const demoFooters = {
    totalUsers:
      userStats?.percentChange !== undefined
        ? userStats.percentChange
        : null,
    totalProducts: "+4.3",
    totalOrders: "-2.1",
    newOrders: "+1.8",
    deliveredOrders: "-0.5",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 p-4 md:p-8">
      {/* Header Section */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-1 h-10 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-purple-600 animate-pulse" />
              <span className="text-sm font-semibold text-purple-600 uppercase tracking-wider">
                Dashboard Overview
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent">
              Analytics & Statistics
            </h1>
          </div>
        </div>
        <p className="text-gray-600 ml-4">
          Track your business performance and key metrics at a glance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {statsConfig.map(({ icon, title, key, iconBg, gradient }, index) => (
          <div
            key={key}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <StatCard
              icon={icon}
              title={title}
              value={dataMap[key]}
              footerText={demoFooters[key]}
              iconBg={iconBg}
              gradient={gradient}
              index={index}
            />
          </div>
        ))}
      </div>

     

      <style jsx>{`
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

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}

export default AdminDashboard;