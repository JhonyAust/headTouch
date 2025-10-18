import { useState } from "react";
import CommonForm from "../common/form";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { useToast } from "../ui/use-toast";
import { 
  Package, 
  Calendar, 
  DollarSign, 
  CreditCard, 
  CheckCircle, 
  MapPin,
  Phone,
  User,
  ShoppingBag,
  Tag,
  Sparkles,
  TrendingUp
} from "lucide-react";

const initialFormData = {
  status: "",
};

function AdminOrderDetailsView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleUpdateStatus(event) {
    event.preventDefault();
    const { status } = formData;

    dispatch(
      updateOrderStatus({ id: orderDetails?._id, orderStatus: status })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        setFormData(initialFormData);
        toast({
          title: data?.payload?.message,
        });
      }
    });
  }

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
    <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden bg-gradient-to-br from-white to-slate-50 border-2 border-purple-100 rounded-2xl">
      <div className="overflow-y-auto max-h-[85vh] px-2 custom-scrollbar my-4 ">
        <div className="space-y-6 p-6">
          {/* Header */}
          <div className="relative animate-slide-down">
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-purple-200/30 rounded-full blur-3xl"></div>
            <div className="relative flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl animate-pulse-slow">
                <ShoppingBag className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black bg-gradient-to-r from-purple-900 to-pink-600 bg-clip-text text-transparent">
                  Order Details
                </h2>
                <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  Complete order information
                </p>
              </div>
            </div>
          </div>

          {/* Order Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
            <div className="group bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-blue-600 mb-1">Order ID</p>
                    <p className="text-sm font-bold text-gray-900">#{orderDetails?._id?.slice(-8)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-purple-600 mb-1">Order Date</p>
                    <p className="text-sm font-bold text-gray-900">
                      {new Date(orderDetails?.orderDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-green-600 mb-1">Total Amount</p>
                    <p className="text-sm font-bold text-gray-900">৳{orderDetails?.totalAmount?.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-4 border border-orange-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-yellow-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-orange-600 mb-1">Payment</p>
                    <p className="text-sm font-bold text-gray-900 capitalize">{orderDetails?.paymentMethod?.replace('_', ' ')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-2 gap-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="bg-white rounded-xl p-4 border-2 border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-gray-500" />
                <p className="text-xs font-semibold text-gray-600">Payment Status</p>
              </div>
              <Badge className={`bg-gradient-to-r ${orderDetails?.paymentStatus === 'paid' ? 'from-green-600 to-emerald-600' : 'from-gray-600 to-gray-800'} text-white font-semibold capitalize`}>
                {orderDetails?.paymentStatus}
              </Badge>
            </div>

            <div className="bg-white rounded-xl p-4 border-2 border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-4 h-4 text-gray-500" />
                <p className="text-xs font-semibold text-gray-600">Order Status</p>
              </div>
              <Badge className={`bg-gradient-to-r ${getStatusColor(orderDetails?.orderStatus)} text-white font-semibold capitalize`}>
                {orderDetails?.orderStatus}
              </Badge>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Order Items */}
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-bold text-gray-900">Order Items</h3>
            </div>
            <div className="space-y-3">
              {orderDetails?.cartItems && orderDetails?.cartItems.length > 0 ? (
                orderDetails.cartItems.map((item, index) => (
                  <div 
                    key={index}
                    className="group bg-white rounded-xl p-4 border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-300 animate-slide-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center shrink-0">
                          <Package className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{item.title}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-purple-600">৳{item.price?.toLocaleString()}</p>
                        {item.quantity > 1 && (
                          <p className="text-xs text-gray-500">৳{(item.price * item.quantity)?.toLocaleString()} total</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No items found</p>
              )}
            </div>

            {orderDetails?.discountAmount > 0 && (
              <div className="mt-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-900">Discount Applied</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">-৳{orderDetails.discountAmount?.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>

          <Separator className="my-6" />

          {/* Shipping Info */}
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-bold text-gray-900">Shipping Information</h3>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200 space-y-3">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-slate-600 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-600 font-semibold">Customer Name</p>
                  <p className="text-sm font-bold text-gray-900">{orderDetails?.addressInfo?.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-slate-600 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-600 font-semibold">Address</p>
                  <p className="text-sm text-gray-900">{orderDetails?.addressInfo?.address}</p>
                  <p className="text-sm text-gray-900">{orderDetails?.addressInfo?.city} - {orderDetails?.addressInfo?.pincode}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-slate-600 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-600 font-semibold">Contact</p>
                  <p className="text-sm font-bold text-gray-900">{orderDetails?.addressInfo?.phone}</p>
                </div>
              </div>

              {orderDetails?.addressInfo?.notes && (
                <div className="flex items-start gap-3 pt-3 border-t border-slate-200">
                  <Package className="w-5 h-5 text-slate-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-600 font-semibold">Delivery Notes</p>
                    <p className="text-sm text-gray-900">{orderDetails.addressInfo.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Update Status Form */}
          <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-bold text-gray-900">Update Status</h3>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
              {formData.status === "delivered" && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-green-800">
                    <span className="font-semibold">Note:</span> Payment status will be automatically set to "Paid" when delivered.
                  </p>
                </div>
              )}
              <CommonForm
                formControls={[
                  {
                    label: "Select New Status",
                    name: "status",
                    componentType: "select",
                    options: [
                      { id: "pending", label: "Pending" },
                      { id: "confirmed", label: "Confirmed" },
                      { id: "inProcess", label: "In Process" },
                      { id: "inShipping", label: "In Shipping" },
                      { id: "delivered", label: "Delivered" },
                      { id: "rejected", label: "Rejected" },
                    ],
                  },
                ]}
                formData={formData}
                setFormData={setFormData}
                buttonText={"Update Order Status"}
                onSubmit={handleUpdateStatus}
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
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

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-slide-down {
          animation: slide-down 0.5s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-in {
          animation: slide-in 0.5s ease-out forwards;
          opacity: 0;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #9333ea, #ec4899);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #7e22ce, #db2777);
        }
      `}</style>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;