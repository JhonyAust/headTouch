import { AlignJustify, LogOut, Bell, ShoppingCart, Package } from "lucide-react";
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
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const socketRef = useRef(null);

  useEffect(() => {
    console.log("\n🔧 ============================================");
    console.log("🚀 Initializing Socket.IO connection...");
    console.log("============================================\n");

    // Initialize socket connection
    const socket = io("https://api.headtouchbd.com", {
      path: "/socket.io/",
      transports: ["polling", "websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      autoConnect: true,
      forceNew: false,
      upgrade: true,
      rememberUpgrade: true,
    });

    socketRef.current = socket;

    // Connection successful
    socket.on("connect", () => {
      console.log("\n✅ ============================================");
      console.log("🎉 SOCKET CONNECTED!");
      console.log("📋 Socket ID:", socket.id);
      console.log("🔌 Transport:", socket.io.engine.transport.name);
      console.log("⏰ Timestamp:", new Date().toISOString());
      console.log("============================================\n");
      setConnectionStatus("connected");
    });

    // Server confirms connection
    socket.on("connected", (data) => {
      console.log("✅ Server confirmation received:", data);
    });

    // Disconnect event
    socket.on("disconnect", (reason) => {
      console.log("\n⚠️ ============================================");
      console.log("❌ SOCKET DISCONNECTED");
      console.log("📝 Reason:", reason);
      console.log("⏰ Timestamp:", new Date().toISOString());
      console.log("============================================\n");
      setConnectionStatus("disconnected");
      
      if (reason === "io server disconnect") {
        console.log("🔄 Manually reconnecting...");
        socket.connect();
      }
    });

    // Connection error
    socket.on("connect_error", (error) => {
      console.error("\n🔴 ============================================");
      console.error("❌ CONNECTION ERROR");
      console.error("Message:", error.message);
      console.error("Type:", error.type);
      console.error("Description:", error.description);
      console.error("============================================\n");
      setConnectionStatus("error");
    });

    // Reconnection attempt
    socket.on("reconnect_attempt", (attemptNumber) => {
      console.log(`🔄 Reconnection attempt #${attemptNumber}...`);
      setConnectionStatus("reconnecting");
    });

    // Reconnected
    socket.on("reconnect", (attemptNumber) => {
      console.log(`✅ Reconnected after ${attemptNumber} attempts`);
      setConnectionStatus("connected");
    });

    // Reconnection failed
    socket.on("reconnect_failed", () => {
      console.error("❌ Reconnection failed after all attempts");
      setConnectionStatus("failed");
    });

    // Transport upgrade
    socket.io.engine.on("upgrade", (transport) => {
      console.log(`🔄 Transport upgraded to: ${transport.name}`);
    });

    // ⭐ CRITICAL: Listen for new orders
    socket.on("newOrderPlaced", (order) => {
      console.log("\n🎊 ============================================");
      console.log("📢 NEW ORDER NOTIFICATION RECEIVED!");
      console.log("📦 Order ID:", order._id);
      console.log("💰 Amount:", order.totalAmount);
      console.log("📊 Status:", order.orderStatus);
      console.log("⏰ Received at:", new Date().toISOString());
      console.log("============================================\n");
      
      // Trigger animation
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
      
      // Add order to list
      setNewOrders((prev) => {
        const updated = [order, ...prev];
        console.log("📋 Updated orders list. Total:", updated.length);
        return updated.slice(0, 6);
      });

      // Play notification sound
      try {
        const audio = new Audio("/notification.mp3");
        audio.play().catch(e => console.log("Audio play failed:", e));
      } catch (e) {
        console.log("Audio not available");
      }
    });

    // Heartbeat mechanism
    const heartbeatInterval = setInterval(() => {
      if (socket.connected) {
        socket.emit("ping");
      }
    }, 30000);

    socket.on("pong", (data) => {
      console.log("💓 Heartbeat acknowledged:", data);
    });

    // Test connection after 2 seconds
    setTimeout(() => {
      if (socket.connected) {
        console.log("🧪 Testing Socket.IO connection...");
        socket.emit("testEvent", { 
          message: "Test from admin panel",
          timestamp: new Date().toISOString() 
        });
      } else {
        console.error("⚠️ Socket not connected after 2 seconds!");
      }
    }, 2000);

    socket.on("testResponse", (data) => {
      console.log("✅ Test response received:", data);
    });

    // Cleanup
    return () => {
      console.log("🧹 Cleaning up socket connection...");
      clearInterval(heartbeatInterval);
      
      if (socket) {
        socket.off("connect");
        socket.off("connected");
        socket.off("disconnect");
        socket.off("connect_error");
        socket.off("reconnect_attempt");
        socket.off("reconnect");
        socket.off("reconnect_failed");
        socket.off("newOrderPlaced");
        socket.off("ping");
        socket.off("pong");
        socket.off("testEvent");
        socket.off("testResponse");
        socket.disconnect();
      }
    };
  }, []);

  function handleLogout() {
    dispatch(logoutUser());
  }

  function handleViewOrder(orderId) {
    navigate(`/admin/orders`);
    setNewOrders((prev) => prev.filter((o) => o._id !== orderId));
  }

  // Get status display
  const getStatusDisplay = () => {
    switch (connectionStatus) {
      case "connected":
        return { color: "bg-green-500", text: "Live notifications" };
      case "connecting":
      case "reconnecting":
        return { color: "bg-yellow-500", text: "Connecting..." };
      case "disconnected":
        return { color: "bg-orange-500", text: "Reconnecting..." };
      case "error":
      case "failed":
        return { color: "bg-red-500", text: "Connection lost" };
      default:
        return { color: "bg-gray-500", text: "Unknown" };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-4 md:px-6 py-4 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-md">
      {/* Animated gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 animate-gradient"></div>

      {/* Left Section */}
      <div className="flex items-center gap-4">
        <Button 
          onClick={() => setOpen(true)} 
          className="lg:hidden group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <AlignJustify className="w-5 h-5 relative z-10 group-hover:rotate-90 transition-transform duration-300" />
          <span className="sr-only">Toggle Menu</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        </Button>

        <div className="hidden md:flex items-center gap-2">
          <div className="w-1 h-8 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full animate-pulse-slow"></div>
          <div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-purple-900 to-pink-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h2>
            <div className="flex items-center gap-2">
              <div 
                className={`w-2 h-2 rounded-full ${statusDisplay.color} ${
                  connectionStatus === "connected" || connectionStatus === "connecting" 
                    ? "animate-pulse" 
                    : ""
                }`}
              ></div>
              <p className="text-xs text-gray-500">
                {statusDisplay.text}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
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
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 rounded-t-xl z-10">
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

            <div className="p-2">
              {newOrders.length > 0 ? (
                newOrders.map((order, index) => (
                  <DropdownMenuItem
                    key={order._id}
                    onClick={() => handleViewOrder(order._id)}
                    className="group cursor-pointer mb-2 p-3 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 border border-transparent hover:border-purple-200 transition-all duration-300 animate-slide-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <ShoppingCart className="w-5 h-5 text-purple-600" />
                      </div>

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
                  <p className="text-xs text-gray-500 mb-2">New orders will appear here</p>
                  <p className="text-xs text-gray-400">
                    Status: <span className="font-semibold">{connectionStatus}</span>
                  </p>
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

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
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

        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }
      `}</style>
    </header>
  );
}

export default AdminHeader;