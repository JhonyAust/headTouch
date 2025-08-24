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
} from "lucide-react";
import {
  getAllUsersForAdmin,
  fetchUserStats,
} from "../../store/admin/user-slice";

function StatCard({ icon: Icon, title, value, footerText, iconBg }) {
  const displayText = footerText ? `${footerText}%` : "No data";
  const displayColor = footerText
    ? parseFloat(footerText) >= 0
      ? "text-green-500"
      : "text-red-500"
    : "text-gray-400";

  return (
    <div className="rounded-2xl bg-white shadow-md p-4 flex flex-col justify-between border">
      <div className="flex justify-between items-center border-b pb-2">
        <div className={`p-2 rounded-full ${iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
        <h4 className="text-sm font-semibold text-right">{title}</h4>
      </div>
      <div className="text-3xl font-bold text-center py-4">{value}</div>
      <div className="border-t pt-2 text-xs text-center">
        <span className={displayColor}>{displayText}</span> than last week
      </div>
    </div>
  );
}

const statsConfig = [
  {
    icon: UsersIcon,
    title: "Total Users",
    key: "totalUsers",
    iconBg: "bg-gray-100 text-gray-900",
  },
  {
    icon: PackageCheck,
    title: "Total Products",
    key: "totalProducts",
    iconBg: "bg-blue-100 text-blue-900",
  },
  {
    icon: ShoppingCart,
    title: "Total Orders",
    key: "totalOrders",
    iconBg: "bg-yellow-100 text-yellow-900",
  },
  {
    icon: PackageSearch,
    title: "New Orders",
    key: "newOrders",
    iconBg: "bg-purple-100 text-purple-900",
  },
  {
    icon: Truck,
    title: "Delivered Orders",
    key: "deliveredOrders",
    iconBg: "bg-green-100 text-green-900",
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

  // 🔧 Footer percentage logic
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
      {statsConfig.map(({ icon, title, key, iconBg }) => (
        <StatCard
          key={key}
          icon={icon}
          title={title}
          value={dataMap[key]}
          footerText={demoFooters[key]}
          iconBg={iconBg}
        />
      ))}
    </div>
  );
}

export default AdminDashboard;
