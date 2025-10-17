import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { DialogContent } from "../ui/dialog";
import { Package, Calendar, DollarSign, Truck, MapPin, Phone, User, CreditCard, CheckCircle, AlertCircle } from "lucide-react";

function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);

  const getStatusConfig = (status) => {
    switch(status) {
      case "delivered":
        return { color: "bg-gradient-to-r from-green-100 to-emerald-100", badge: "bg-gradient-to-r from-green-600 to-emerald-600", icon: CheckCircle };
      case "rejected":
        return { color: "bg-gradient-to-r from-red-100 to-orange-100", badge: "bg-gradient-to-r from-red-600 to-orange-600", icon: AlertCircle };
      case "processing":
        return { color: "bg-gradient-to-r from-blue-100 to-cyan-100", badge: "bg-gradient-to-r from-blue-600 to-cyan-600", icon: Package };
      default:
        return { color: "bg-gradient-to-r from-gray-100 to-slate-100", badge: "bg-gradient-to-r from-gray-600 to-slate-600", icon: Package };
    }
  };

  const getPaymentStatusConfig = (status) => {
    switch(status) {
      case "paid":
        return "bg-gradient-to-r from-green-600 to-emerald-600";
      case "pending":
        return "bg-gradient-to-r from-yellow-600 to-orange-600";
      default:
        return "bg-gradient-to-r from-gray-600 to-slate-600";
    }
  };

  const statusConfig = getStatusConfig(orderDetails?.orderStatus);
  const StatusIcon = statusConfig.icon;

  return (
    <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto rounded-2xl border-2 border-gray-100 p-0">
      {/* Header Section */}
      <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white  z-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">Order Details</h2>
            <p className="text-white/80 text-sm">Order ID: {orderDetails?._id}</p>
          </div>
          <div className={`${statusConfig.color} p-3 rounded-xl`}>
            <StatusIcon className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        
        {/* Order Status & Summary */}
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Current Status</p>
              <p className={`text-2xl font-black capitalize ${
                orderDetails?.orderStatus === "delivered"
                  ? "text-green-600"
                  : orderDetails?.orderStatus === "rejected"
                  ? "text-red-600"
                  : orderDetails?.orderStatus === "processing"
                  ? "text-blue-600"
                  : "text-gray-900"
              }`}>
                {orderDetails?.orderStatus}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-full font-semibold text-base capitalize ${
              orderDetails?.orderStatus === "delivered"
                ? "text-green-600 bg-green-50 border border-green-200"
                : orderDetails?.orderStatus === "rejected"
                ? "text-red-600 bg-red-50 border border-red-200"
                : orderDetails?.orderStatus === "processing"
                ? "text-blue-600 bg-blue-50 border border-blue-200"
                : "text-gray-600 bg-gray-100 border border-gray-300"
            }`}>
              {orderDetails?.orderStatus}
            </div>
          </div>
        </div>

        {/* Order Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Date Card */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100 hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-600">Order Date</span>
            </div>
            <p className="font-bold text-gray-900 ml-13">{orderDetails?.orderDate.split("T")[0]}</p>
          </div>

          {/* Amount Card */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100 hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-600">Total Amount</span>
            </div>
            <p className="font-bold text-gray-900 text-xl ml-13">৳ {orderDetails?.totalAmount}</p>
          </div>

          {/* Payment Method Card */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100 hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-600">Payment Method</span>
            </div>
            <p className="font-bold text-gray-900 ml-13 capitalize">{orderDetails?.paymentMethod}</p>
          </div>

          {/* Payment Status Card */}
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-4 border border-orange-100 hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center`}
                style={{
                  backgroundImage: `linear-gradient(135deg, ${orderDetails?.paymentStatus === "paid" ? "#16a34a 0%, #10b981 100%" : "#ea580c 0%, #f59e0b 100%"})`
                }}
              >
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-600">Payment Status</span>
            </div>
            <Badge className={`${getPaymentStatusConfig(orderDetails?.paymentStatus)} text-white capitalize font-semibold ml-13`}>
              {orderDetails?.paymentStatus}
            </Badge>
          </div>
        </div>

        {/* Order Items Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            Order Items
          </h3>
          <div className="space-y-2">
            {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
              ? orderDetails?.cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{item.title}</p>
                        <p className="text-sm text-gray-600 mt-1">SKU: {item._id?.slice(-8)}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold text-sm">
                            Qty: {item.quantity}
                          </div>
                          <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold text-sm">
                            ৳ {item.price}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              : (
                <div className="text-center py-8 text-gray-500">
                  <p>No items in this order</p>
                </div>
              )}
          </div>
        </div>

        {/* Shipping Info Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-600" />
            Shipping Information
          </h3>
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border-2 border-indigo-100">
            <div className="space-y-4">
              {/* User Info */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase">Recipient</p>
                  <p className="font-bold text-gray-900">{user?.userName}</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase">Address</p>
                  <p className="font-semibold text-gray-900">{orderDetails?.addressInfo?.address}</p>
                  <p className="text-sm text-gray-700 mt-1">
                    {orderDetails?.addressInfo?.city}, {orderDetails?.addressInfo?.pincode}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase">Phone</p>
                  <p className="font-bold text-gray-900">{orderDetails?.addressInfo?.phone}</p>
                </div>
              </div>

              {/* Special Notes */}
              {orderDetails?.addressInfo?.notes && (
                <div className="mt-4 p-3 bg-white/60 rounded-lg border border-indigo-200">
                  <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Delivery Notes</p>
                  <p className="text-sm text-gray-700 italic">{orderDetails?.addressInfo?.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </DialogContent>
  );
}

export default ShoppingOrderDetailsView;