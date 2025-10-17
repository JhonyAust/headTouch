import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import ShoppingOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersByUserId,
  getOrderDetails,
  resetOrderDetails,
} from "@/store/shop/order-slice";
import { Badge } from "../ui/badge";
import { Package, Calendar, DollarSign, Eye, ShoppingBag, CheckCircle, Clock, XCircle } from "lucide-react";

function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector((state) => state.shopOrder);

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetails(getId));
  }

  useEffect(() => {
    dispatch(getAllOrdersByUserId(user?.id));
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  const getStatusIcon = (status) => {
    switch(status) {
      case "delivered": return <CheckCircle className="w-4 h-4" />;
      case "rejected": return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
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
    <div className="space-y-4">
      {orderList && orderList.length > 0 ? (
        <div className="space-y-4">
          {orderList.map((orderItem, index) => (
            <div
              key={orderItem._id}
              className="group bg-white rounded-xl border-2 border-gray-100 hover:border-purple-200 p-6 hover:shadow-lg transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Order Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Package className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-semibold text-gray-600">Order ID:</span>
                      <span className="font-mono text-sm font-bold text-purple-600">
                        #{orderItem._id.slice(-8)}
                      </span>
                    </div>
                    <div className="hidden md:flex items-center gap-2 text-gray-400">•</div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {new Date(orderItem.orderDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-wrap">
                    <Badge
                      className={`py-2 px-4 font-semibold text-white shadow-md bg-gradient-to-r ${getStatusColor(orderItem.orderStatus)} flex items-center gap-2`}
                    >
                      {getStatusIcon(orderItem.orderStatus)}
                      <span className="capitalize">{orderItem.orderStatus}</span>
                    </Badge>

                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <span className="text-2xl font-black text-gray-900">
                        ৳{orderItem.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* View Details Button */}
                <Dialog
                  open={openDetailsDialog}
                  onOpenChange={() => {
                    setOpenDetailsDialog(false);
                    dispatch(resetOrderDetails());
                  }}
                >
                  <Button
                    onClick={() => handleFetchOrderDetails(orderItem._id)}
                    className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-md hover:shadow-xl transition-all duration-300 flex items-center gap-2 hover:scale-105 whitespace-nowrap"
                  >
                    <Eye className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                    View Details
                  </Button>
                  <ShoppingOrderDetailsView orderDetails={orderDetails} />
                </Dialog>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full blur-2xl opacity-50 animate-pulse-slow"></div>
            <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-full p-8 border-2 border-slate-200/50 shadow-lg">
              <ShoppingBag className="w-20 h-20 text-slate-300" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">
            No Orders Yet
          </h3>
          <p className="text-sm text-slate-500 mb-6 max-w-md text-center leading-relaxed">
            You haven't placed any orders yet. Start shopping to see your orders here!
          </p>
        </div>
      )}

      <style jsx>{`
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

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default ShoppingOrders;