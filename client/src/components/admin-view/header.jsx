import { AlignJustify, LogOut, Bell } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "../ui/dropdown-menu";

function AdminHeader({ setOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [newOrders, setNewOrders] = useState([]); // Holds up to 5 orders
  const socketRef = useRef(null);

useEffect(() => {
  socketRef.current = io("https://api.headtouchbd.com");

  socketRef.current.on("connect", () => {
    console.log("✅ Connected to socket server:", socketRef.current.id);
  });

  socketRef.current.on("newOrderPlaced", (order) => {
    console.log("📢 New order received:", order);
    setNewOrders((prev) => {
      const updated = [order, ...prev];
      console.log("📌 Updated Orders:", updated);
      return updated.slice(0, 6); // keep only 6 latest
    });
  });

  return () => {
    if (socketRef.current) socketRef.current.disconnect();
  };
}, []);



  function handleLogout() {
    dispatch(logoutUser());
  }

  function handleViewOrder(orderId) {
    navigate(`/admin/orders/${orderId}`);
    setNewOrders((prev) => prev.filter((o) => o._id !== orderId));
  }

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b">
      {/* ☰ Toggle Sidebar Button (mobile) */}
      <Button onClick={() => setOpen(true)} className="lg:hidden sm:block">
        <AlignJustify />
        <span className="sr-only">Toggle Menu</span>
      </Button>

      {/* 🔔 Notifications + 🔓 Logout aligned to right */}
      <div className="ml-auto flex items-center gap-4">
        {/* 🔔 Notification Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative p-2">
              <Bell className="w-6 h-6" />
              {newOrders.length > 0 && (
                <>
                  {newOrders.length === 1 ? (
                    // Green dot for exactly 1 new order (subtle)
                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-green-500" />
                  ) : (
                    // Red badge with number for 2 or more new orders (urgent)
                    <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {newOrders.length}
                    </span>
                  )}
                </>
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-64 max-h-60 overflow-auto">
            <div className="px-2 py-2 font-semibold border-b">
              New Orders ({newOrders.length})
            </div>
            {newOrders.length > 0 ? (
              newOrders.map((order) => (
                <DropdownMenuItem
                  key={order._id}
                  onClick={() => handleViewOrder(order._id)}
                  className="cursor-pointer"
                >
                   <span className="text-sm font-medium">
                    🛒 #{order._id.slice(-5)} - ${order.totalAmount}
                  </span>
                  
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem disabled>No new orders</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 🔓 Logout Button */}
        <Button
          onClick={handleLogout}
          className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow"
        >
          <LogOut />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
}

export default AdminHeader;
