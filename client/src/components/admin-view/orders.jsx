import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogContent } from "../ui/dialog";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
} from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";
import { 
  Package, 
  Calendar, 
  DollarSign, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  ShoppingBag,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  TrendingUp
} from "lucide-react";

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 8;
  const navigate = useNavigate();
  const { orderList, orderDetails } = useSelector((state) => state.adminOrder);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails) setOpenDetailsDialog(true);
    else setOpenDetailsDialog(false);
  }, [orderDetails]);

  const handleFetchOrderDetails = (getId) => {
    dispatch(getOrderDetailsForAdmin(getId));
  };

  // Pagination logic
  const totalPages = Math.ceil(orderList.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const endIndex = startIndex + ordersPerPage;
  const paginatedOrders = orderList.slice(startIndex, endIndex);

  // Stats calculation
  const totalOrders = orderList.length;
  const deliveredOrders = orderList.filter(o => o.orderStatus === "delivered").length;
  const pendingOrders = orderList.filter(o => o.orderStatus === "pending" || o.orderStatus === "confirmed").length;
  const totalRevenue = orderList.reduce((sum, order) => sum + order.totalAmount, 0);

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
    <div className="space-y-6 p-6 animate-fade-in">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="group bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-slide-in" style={{ animationDelay: '0s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-blue-600 opacity-50" />
          </div>
          <p className="text-sm font-semibold text-blue-600 mb-1">Total Orders</p>
          <p className="text-3xl font-black text-gray-900">{totalOrders}</p>
        </div>

        <div className="group bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-slide-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <Sparkles className="w-5 h-5 text-green-600 opacity-50" />
          </div>
          <p className="text-sm font-semibold text-green-600 mb-1">Delivered</p>
          <p className="text-3xl font-black text-gray-900">{deliveredOrders}</p>
        </div>

        <div className="group bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 border border-orange-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-slide-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <Package className="w-5 h-5 text-orange-600 opacity-50" />
          </div>
          <p className="text-sm font-semibold text-orange-600 mb-1">Pending</p>
          <p className="text-3xl font-black text-gray-900">{pendingOrders}</p>
        </div>

        <div className="group bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-slide-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-purple-600 opacity-50" />
          </div>
          <p className="text-sm font-semibold text-purple-600 mb-1">Total Revenue</p>
          <p className="text-2xl font-black text-gray-900">৳{totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Orders Table Card */}
      <Card className="border-2 border-gray-100 shadow-xl rounded-2xl overflow-hidden animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 border-b-2 border-gray-100 pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  All Orders
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">Manage and track all customer orders</p>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 text-sm font-bold">
              {totalOrders} Total
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50 border-b-2 border-gray-200">
                  <TableHead className="font-bold text-gray-700 py-4">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-500" />
                      Order ID
                    </div>
                  </TableHead>
                  <TableHead className="hidden md:table-cell font-bold text-gray-700">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      Date
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-gray-700">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-gray-500" />
                      Status
                    </div>
                  </TableHead>
                  <TableHead className="hidden md:table-cell font-bold text-gray-700">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      Amount
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-gray-700">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-gray-500" />
                      Actions
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedOrders.map((orderItem, index) => (
                  <TableRow 
                    key={orderItem._id} 
                    className="group hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300 border-b border-gray-100 animate-fade-in-row"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <TableCell className="font-medium py-4">
                      <button
                        onClick={() => navigate(`/admin/orders/${orderItem._id}`)}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 font-bold hover:underline group"
                      >
                        <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-xs group-hover:bg-blue-200 transition-colors duration-200">
                          #{orderItem._id.slice(-3)}
                        </span>
                        <span className="hidden sm:inline">{orderItem._id.slice(-8)}</span>
                      </button>
                    </TableCell>

                    <TableCell className="hidden md:table-cell text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(orderItem.orderDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        className={`py-2 px-3 font-semibold text-white shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-r ${getStatusColor(orderItem.orderStatus)} flex items-center gap-1.5 w-fit`}
                      >
                        {getStatusIcon(orderItem.orderStatus)}
                        <span className="capitalize">{orderItem.orderStatus}</span>
                      </Badge>
                    </TableCell>

                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-2 font-bold text-gray-900">
                        <span className="text-green-600">৳</span>
                        {orderItem.totalAmount.toLocaleString()}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Dialog
                        open={openDetailsDialog}
                        onOpenChange={() => {
                          setOpenDetailsDialog(false);
                          dispatch(resetOrderDetails());
                        }}
                      >
                        <Button 
                          onClick={() => handleFetchOrderDetails(orderItem._id)}
                          className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 hover:scale-105"
                        >
                          <Eye className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                          <span className="hidden sm:inline">View</span>
                        </Button>
                        <DialogContent className="w-full max-w-md sm:max-w-lg mx-auto rounded-2xl border-2 border-purple-100">
                          <AdminOrderDetailsView orderDetails={orderDetails} />
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center gap-4 p-6 bg-gray-50 border-t-2 border-gray-200">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                variant="outline"
                className="flex items-center gap-2 disabled:opacity-50 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous</span>
              </Button>

              <div className="flex items-center gap-2">
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`w-10 h-10 rounded-lg font-bold transition-all duration-300 ${
                      currentPage === idx + 1
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-110'
                        : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              <Button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                variant="outline"
                className="flex items-center gap-2 disabled:opacity-50 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 disabled:cursor-not-allowed"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <style jsx>{`
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

        @keyframes fade-in-row {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animate-slide-in {
          animation: slide-in 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in-row {
          animation: fade-in-row 0.4s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}

export default AdminOrdersView;