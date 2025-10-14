import { AlignJustify, LogOut, Bell, ShoppingCart, Package, Sparkles } from "lucide-react";
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

  const [newOrders, setNewOrders] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io("https://api.headtouchbd.com");

    socketRef.current.on("connect", () => {
      console.log("✅ Connected to socket server:", socketRef.current.id);
    });

    socketRef.current.on("newOrderPlaced", (order) => {
      console.log("📢 New order received:", order);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
      
      setNewOrders((prev) => {
        const updated = [order, ...prev];
        console.log("📌 Updated Orders:", updated);
        return updated.slice(0, 6);
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
    <header className="sticky top-0 z-40 flex items-center justify-between px-4 md:px-6 py-4 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-md">
      {/* Animated gradient line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 animate-gradient"></div>

      {/* Left Section - Menu Toggle */}
      <div className="flex items-center gap-4">
        <Button 
          onClick={() => setOpen(true)} 
          className="lg:hidden group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <AlignJustify className="w-5 h-5 relative z-10 group-hover:rotate-90 transition-transform duration-300" />
          <span className="sr-only">Toggle Menu</span>
          
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        </Button>

        {/* Title - visible on larger screens */}
        <div className="hidden md:flex items-center gap-2">
          <div className="w-1 h-8 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full animate-pulse-slow"></div>
          <div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-purple-900 to-pink-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h2>
            <p className="text-xs text-gray-500">Manage your store</p>
          </div>
        </div>
      </div>

      {/* Right Section - Notifications + Logout */}
      <div className="flex items-center gap-3">
        {/* Notification Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className={`relative p-2 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 ${
                isAnimating ? 'animate-wiggle' : ''
              }`}
            >
              <Bell className={`w-6 h-6 text-gray-700 ${isAnimating ? 'animate-ring' : ''}`} />
              
              {newOrders.length > 0 && (
                <>
                  {newOrders.length === 1 ? (
                    <span className="absolute top-1 right-1 h-3 w-3 rounded-full bg-green-500 animate-ping-slow">
                      <span className="absolute inset-0 rounded-full bg-green-500"></span>
                    </span>
                  ) : (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-600 to-orange-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-lg animate-bounce-subtle">
                      {newOrders.length}
                    </span>
                  )}
                </>
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-auto mt-2 border-2 border-purple-100 shadow-2xl rounded-2xl">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  <span className="font-bold">New Orders</span>
                </div>
                <span className="bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold">
                  {newOrders.length}
                </span>
              </div>
            </div>

            {/* Order List */}
            <div className="p-2">
              {newOrders.length > 0 ? (
                newOrders.map((order, index) => (
                  <DropdownMenuItem
                    key={order._id}
                    onClick={() => handleViewOrder(order._id)}
                    className="group cursor-pointer mb-2 p-3 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 border border-transparent hover:border-purple-200 transition-all duration-300"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center gap-3 w-full">
                      {/* Icon */}
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <ShoppingCart className="w-5 h-5 text-purple-600" />
                      </div>

                      {/* Order Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-purple-600">
                            #{order._id.slice(-5)}
                          </span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">Just now</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-900">
                            ৳{order.totalAmount}
                          </span>
                          <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">
                            New
                          </span>
                        </div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">No new orders</p>
                  <p className="text-xs text-gray-500">New orders will appear here</p>
                </div>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          className="group relative overflow-hidden inline-flex gap-2 items-center rounded-xl px-4 py-2 text-sm font-semibold shadow-lg hover:shadow-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white border-0 transition-all duration-300 hover:scale-105"
        >
          <LogOut className="w-4 h-4 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
          <span className="hidden sm:inline relative z-10">Logout</span>
          
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        </Button>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
        }

        @keyframes ring {
          0%, 100% { transform: rotate(0deg); }
          10%, 30% { transform: rotate(-15deg); }
          20%, 40% { transform: rotate(15deg); }
        }

        @keyframes ping-slow {
          75%, 100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-wiggle {
          animation: wiggle 0.5s ease-in-out;
        }

        .animate-ring {
          animation: ring 1s ease-in-out;
        }

        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </header>
  );
}

export default AdminHeader;