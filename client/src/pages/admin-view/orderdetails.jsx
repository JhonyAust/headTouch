import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderDetailsForAdmin, resetOrderDetails } from "@/store/admin/order-slice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  Calendar, 
  DollarSign, 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Clock,
  MapPin,
  Phone,
  User,
  FileText,
  Home,
  Tag,
  Sparkles,
  ArrowLeft,
  ShoppingCart,
  Receipt
} from "lucide-react";

function AdminOrderDetailsPage() {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderDetails } = useSelector((state) => state.adminOrder);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (orderId) {
      dispatch(getOrderDetailsForAdmin(orderId));
    }
    return () => {
      dispatch(resetOrderDetails());
    };
  }, [dispatch, orderId]);

  const getStatusIcon = (status) => {
    switch(status) {
      case "delivered": return <CheckCircle className="w-5 h-5" />;
      case "rejected": return <XCircle className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "delivered": return "from-green-600 to-emerald-600";
      case "rejected": return "from-red-600 to-rose-600";
      case "confirmed": return "from-blue-600 to-cyan-600";
      case "pending": return "from-yellow-600 to-orange-600";
      case "inProcess": return "from-purple-600 to-pink-600";
      case "inShipping": return "from-indigo-600 to-purple-600";
      default: return "from-gray-600 to-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/20 p-4 md:p-8">
      {/* Animated Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-20 animate-float-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 3}px`,
              height: `${Math.random() * 6 + 3}px`,
              background: i % 2 === 0 ? '#60a5fa' : '#a78bfa',
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 8}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Back Button */}
        <Button
          onClick={() => navigate("/admin/orders")}
          variant="outline"
          className="mb-6 border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-300 animate-slide-in"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Orders
        </Button>

        {/* Header Card */}
        <Card className="border-2 border-purple-100 shadow-2xl rounded-2xl overflow-hidden mb-6 animate-slide-down">
          <CardHeader className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white pb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl">
                  <Receipt className="w-8 h-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold mb-2">Order Details</CardTitle>
                  <div className="flex items-center gap-2 text-white/90">
                    <Package className="w-4 h-4" />
                    <span className="text-sm font-medium">ID: {orderDetails?._id?.slice(-8)}</span>
                  </div>
                </div>
              </div>
              <Badge
                className={`py-3 px-6 font-bold text-white shadow-xl bg-gradient-to-r ${getStatusColor(orderDetails?.orderStatus)} flex items-center gap-2 w-fit text-base`}
              >
                {getStatusIcon(orderDetails?.orderStatus)}
                <span className="capitalize">{orderDetails?.orderStatus}</span>
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-8 space-y-8">
            {/* Order Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="group bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border-2 border-blue-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-blue-600">Order Date</p>
                </div>
                <p className="text-lg font-bold text-gray-900">{orderDetails?.orderDate?.split("T")[0]}</p>
              </div>

              <div className="group bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-green-600">Total Amount</p>
                </div>
                <p className="text-2xl font-black text-gray-900">৳ {orderDetails?.totalAmount?.toLocaleString()}</p>
              </div>

              <div className="group bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border-2 border-purple-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-purple-600">Payment Method</p>
                </div>
                <p className="text-lg font-bold text-gray-900 capitalize">{orderDetails?.paymentMethod}</p>
              </div>

              <div className="group bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-5 border-2 border-orange-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-orange-600">Payment Status</p>
                </div>
                <p className="text-lg font-bold text-gray-900 capitalize">{orderDetails?.paymentStatus}</p>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Cart Items Section */}
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-900 to-purple-900 bg-clip-text text-transparent">
                  Order Items
                </h3>
                <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                  {orderDetails?.cartItems?.length} items
                </Badge>
              </div>

              <div className="space-y-4">
                {orderDetails?.cartItems?.map((item, index) => (
                  <div
                    key={index}
                    className="group bg-gradient-to-br from-white to-gray-50 rounded-xl p-5 border-2 border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 animate-slide-in"
                    style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Package className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 text-lg mb-1">{item.title}</p>
                          <p className="text-sm text-gray-600">Quantity: <span className="font-semibold text-indigo-600">{item.quantity}</span></p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-black text-green-600">৳{item.price?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="my-8" />

            {/* Shipping Information */}
            <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-rose-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-rose-900 to-pink-900 bg-clip-text text-transparent">
                  Shipping Information
                </h3>
              </div>

              <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-6 border-2 border-rose-100 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
                      <User className="w-5 h-5 text-rose-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium mb-1">Customer Name</p>
                      <p className="text-lg font-bold text-gray-900">{user?.userName}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
                      <Phone className="w-5 h-5 text-rose-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium mb-1">Phone Number</p>
                      <p className="text-lg font-bold text-gray-900">{orderDetails?.addressInfo?.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 md:col-span-2">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
                      <Home className="w-5 h-5 text-rose-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 font-medium mb-1">Address</p>
                      <p className="text-lg font-bold text-gray-900 mb-2">{orderDetails?.addressInfo?.address}</p>
                      <p className="text-base text-gray-700">
                        {orderDetails?.addressInfo?.city} - {orderDetails?.addressInfo?.pincode}
                      </p>
                    </div>
                  </div>

                  {orderDetails?.addressInfo?.notes && (
                    <div className="flex items-start gap-4 md:col-span-2">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
                        <FileText className="w-5 h-5 text-rose-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 font-medium mb-1">Delivery Notes</p>
                        <p className="text-base font-medium text-gray-900">{orderDetails?.addressInfo?.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Coupon Information */}
            {orderDetails?.couponCode && (
              <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <Separator className="my-8" />
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Tag className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-900 to-orange-900 bg-clip-text text-transparent">
                    Coupon Applied
                  </h3>
                  <Sparkles className="w-5 h-5 text-amber-600" />
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200 shadow-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
                        <Tag className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Coupon Code</p>
                        <p className="text-lg font-bold text-gray-900">{orderDetails.couponCode}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
                        <Sparkles className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Discount</p>
                        <p className="text-lg font-bold text-amber-600">{orderDetails.discountPercentage}%</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
                        <DollarSign className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Saved Amount</p>
                        <p className="text-lg font-bold text-green-600">৳{orderDetails.discountAmount?.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-30px) translateX(20px);
          }
        }

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

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float-slow {
          animation: float-slow ease-in-out infinite;
        }

        .animate-slide-in {
          animation: slide-in 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-down {
          animation: slide-down 0.6s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}

export default AdminOrderDetailsPage;