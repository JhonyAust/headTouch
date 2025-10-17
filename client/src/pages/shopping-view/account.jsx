import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import { getAllOrdersByUserId } from "@/store/shop/order-slice";
import { fetchAllAddresses } from "@/store/shop/address-slice";
import accImg from "../../assets/account.jpg";
import Address from "@/components/shopping-view/address";
import ShoppingOrders from "@/components/shopping-view/orders";
import { 
  User, 
  Package, 
  MapPin, 
  LogOut, 
  Mail, 
  Calendar,
  ShoppingBag,
  Sparkles,
  Crown,
  Shield
} from "lucide-react";
import { useState, useEffect } from "react";

function ShoppingAccount() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList } = useSelector((state) => state.shopOrder);
  const { addressList } = useSelector((state) => state.shopAddress);
  const [activeTab, setActiveTab] = useState("orders");

  useEffect(() => {
    if (user?.id) {
      dispatch(getAllOrdersByUserId(user?.id));
      dispatch(fetchAllAddresses(user?.id));
    }
  }, [dispatch, user?.id]);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const totalOrders = orderList?.length || 0;
  const totalAddresses = addressList?.length || 0;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
      {/* Hero Banner with Overlay */}
      <div className="relative h-[280px] md:h-[400px] w-full overflow-hidden">
        {/* Image */}
        <img
          src={accImg}
          className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
          alt="Account Banner"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
        
        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>

        {/* User Profile Card */}
        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-8">
          <div className="container mx-auto px-0 md:px-4">
            <div className="flex flex-row md:flex-row items-start md:items-end gap-3 md:gap-6 animate-slide-up">
              {/* Avatar - Smaller on mobile */}
              <div className="relative group flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl md:rounded-2xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative w-16 h-16 md:w-32 md:h-32 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-2xl border-3 md:border-4 border-white group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl md:text-5xl font-black text-white">
                    {user?.userName?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* User Info - Responsive text sizes */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2 flex-wrap">
                  <h1 className="text-lg md:text-4xl font-black text-white drop-shadow-lg truncate">
                    {user?.userName}
                  </h1>
                  <div className="flex items-center gap-1 px-2 md:px-3 py-0.5 md:py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex-shrink-0">
                    <Crown className="w-3 h-3 md:w-4 md:h-4 text-white" />
                    <span className="text-xs font-bold text-white hidden sm:inline">Member</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 md:gap-4 text-white/90 text-xs md:text-sm">
                  <div className="flex items-center gap-1 md:gap-2 truncate">
                    <Mail className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                    <span className="truncate">{user?.email}</span>
                  </div>
                  {user?.createdAt && (
                    <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                      <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                      <span>
                        Joined {new Date(user.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Logout Button - Inline on mobile */}
              <button
                onClick={handleLogout}
                className="group flex items-center gap-1 md:gap-2 px-3 md:px-6 py-2 md:py-3 bg-white/10 backdrop-blur-md hover:bg-white/20 border-2 border-white/30 hover:border-white/50 rounded-lg md:rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 shadow-lg flex-shrink-0 text-sm md:text-base whitespace-nowrap"
              >
                <LogOut className="w-4 h-4 md:w-5 md:h-5 group-hover:rotate-12 transition-transform duration-300" />
                <span className="inline">Sign Out</span>
              
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-3 md:px-6 py-6 md:py-8 -mt-6 md:-mt-8 relative z-10 w-full">
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-gray-100 overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Enhanced Tabs Header - Equal width on mobile */}
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-200 p-2 md:p-6">
              <TabsList className="flex h-10 md:h-12 items-center justify-center rounded-lg md:rounded-xl bg-white p-1 shadow-sm border border-gray-200 w-full gap-1 md:gap-2">
                <TabsTrigger 
                  value="orders"
                  className="flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 md:px-6 py-2 md:py-2.5 text-xs md:text-sm font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-md"
                >
                  <Package className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Orders</span>
                  <span className="sm:hidden">Order</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="address"
                  className="flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 md:px-6 py-2 md:py-2.5 text-xs md:text-sm font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-md"
                >
                  <MapPin className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Addresses</span>
                  <span className="sm:hidden">Address</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab Content */}
            <div className="p-3 md:p-6">
              <TabsContent value="orders" className="mt-0 animate-fade-in">
                <div className="mb-3 md:mb-4 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                  <h3 className="text-lg md:text-xl font-bold text-gray-900">Your Orders</h3>
                  <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-purple-400" />
                </div>
                <ShoppingOrders />
              </TabsContent>
              
              <TabsContent value="address" className="mt-0 animate-fade-in">
                <div className="mb-3 md:mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                  <h3 className="text-lg md:text-xl font-bold text-gray-900">Saved Addresses</h3>
                  <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-blue-400" />
                </div>
                <Address />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mt-4 md:mt-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="group bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg md:rounded-xl p-4 md:p-6 border border-purple-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                <Package className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm font-semibold text-purple-600">Total Orders</p>
                <p className="text-xl md:text-2xl font-black text-gray-900">{totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg md:rounded-xl p-4 md:p-6 border border-green-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                <MapPin className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm font-semibold text-green-600">Saved Addresses</p>
                <p className="text-xl md:text-2xl font-black text-gray-900">{totalAddresses}</p>
              </div>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg md:rounded-xl p-4 md:p-6 border border-blue-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                <Shield className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm font-semibold text-blue-600">Account Status</p>
                <p className="text-lg md:text-lg font-bold text-gray-900">Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default ShoppingAccount;