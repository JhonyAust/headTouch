import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from "@/store/admin/coupon-slice";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tag,
  Plus,
  Edit,
  Trash2,
  Percent,
  Calendar,
  Copy,
  Sparkles,
  TrendingUp,
  CheckCircle,
  XCircle,
  Gift,
  Clock
} from "lucide-react";

function AdminCouponsView() {
  const dispatch = useDispatch();
  const { coupons, loading } = useSelector((state) => state.adminCoupon);

  const [openDialog, setOpenDialog] = useState(false);
  const [editCoupon, setEditCoupon] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    discountPercentage: "",
    expiryDate: "",
  });
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    dispatch(fetchCoupons());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editCoupon) {
      dispatch(updateCoupon({ id: editCoupon._id, formData }));
    } else {
      dispatch(createCoupon(formData));
    }
    setOpenDialog(false);
    setEditCoupon(null);
    setFormData({ name: "", code: "", discountPercentage: "", expiryDate: "" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      dispatch(deleteCoupon(id));
    }
  };

  const handleEdit = (coupon) => {
    setEditCoupon(coupon);
    setFormData({
      name: coupon.name,
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
      expiryDate: coupon.expiryDate?.split("T")[0] || "",
    });
    setOpenDialog(true);
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Stats calculation
  const totalCoupons = coupons?.length || 0;
  const activeCoupons = coupons?.filter(c => c.isActive).length || 0;
  const avgDiscount = coupons?.length > 0 
    ? Math.round(coupons.reduce((sum, c) => sum + c.discountPercentage, 0) / coupons.length)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50/20 p-4 md:p-8">
      {/* Animated Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-20 animate-float-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 3}px`,
              height: `${Math.random() * 6 + 3}px`,
              background: i % 2 === 0 ? '#f43f5e' : '#ec4899',
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 8}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 animate-slide-down">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-rose-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse-subtle">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-900 via-pink-800 to-purple-700 bg-clip-text text-transparent">
                Coupon Management
              </h1>
              <p className="text-gray-600 mt-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-600" />
                Create and manage discount coupons
              </p>
            </div>
          </div>
          <Button 
            onClick={() => {
              setEditCoupon(null);
              setFormData({ name: "", code: "", discountPercentage: "", expiryDate: "" });
              setOpenDialog(true);
            }}
            className="group bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 hover:from-rose-700 hover:via-pink-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 h-14 px-8 rounded-xl text-base font-bold hover:scale-105"
          >
            <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
            Create Coupon
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="group border-2 border-rose-100 hover:border-rose-300 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden animate-slide-in" style={{ animationDelay: '0s' }}>
            <CardContent className="p-6 bg-gradient-to-br from-rose-50 to-pink-50">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Tag className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-rose-600 opacity-50" />
              </div>
              <p className="text-sm font-semibold text-rose-600 mb-1">Total Coupons</p>
              <p className="text-3xl font-black text-gray-900">{totalCoupons}</p>
            </CardContent>
          </Card>

          <Card className="group border-2 border-green-100 hover:border-green-300 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden animate-slide-in" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-6 bg-gradient-to-br from-green-50 to-emerald-50">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <Sparkles className="w-5 h-5 text-green-600 opacity-50" />
              </div>
              <p className="text-sm font-semibold text-green-600 mb-1">Active Coupons</p>
              <p className="text-3xl font-black text-gray-900">{activeCoupons}</p>
            </CardContent>
          </Card>

          <Card className="group border-2 border-purple-100 hover:border-purple-300 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-6 bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Percent className="w-6 h-6 text-white" />
                </div>
                <Sparkles className="w-5 h-5 text-purple-600 opacity-50" />
              </div>
              <p className="text-sm font-semibold text-purple-600 mb-1">Avg. Discount</p>
              <p className="text-3xl font-black text-gray-900">{avgDiscount}%</p>
            </CardContent>
          </Card>
        </div>

        {/* Coupons List */}
        <Card className="border-2 border-gray-100 shadow-xl rounded-2xl overflow-hidden animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 border-b-2 border-gray-100 pb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-rose-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    All Coupons
                  </CardTitle>
                  <p className="text-sm text-gray-500 mt-1">Manage discount codes</p>
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-rose-600 to-pink-600 text-white px-4 py-2 text-sm font-bold">
                {totalCoupons} Total
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-rose-200 border-t-rose-600"></div>
              </div>
            ) : coupons.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full blur-3xl opacity-50 animate-pulse-slow"></div>
                  <div className="relative bg-gradient-to-br from-white to-rose-50/50 rounded-full p-12 border-2 border-rose-200/50 shadow-2xl">
                    <Tag className="w-24 h-24 text-rose-300" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">No Coupons Yet</h3>
                <p className="text-gray-500 text-base mb-8 max-w-md text-center leading-relaxed">
                  Create your first coupon to offer discounts to customers
                </p>
                <Button 
                  onClick={() => setOpenDialog(true)}
                  className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 h-12 px-8 rounded-xl font-semibold hover:scale-105"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create First Coupon
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {coupons.map((coupon, index) => (
                  <div
                    key={coupon._id}
                    className="group bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border-2 border-gray-200 hover:border-rose-300 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden animate-scale-in hover:-translate-y-1"
                    style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                  >
                    <div className="p-6 space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-rose-600 to-pink-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                              <Gift className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="font-bold text-xl text-gray-900 line-clamp-1">{coupon.name}</h3>
                          </div>
                        </div>
                        <Badge
                          className={`font-bold py-1.5 px-4 flex items-center gap-1.5 ${
                            coupon.isActive
                              ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                              : "bg-gradient-to-r from-gray-600 to-gray-700 text-white"
                          }`}
                        >
                          {coupon.isActive ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <XCircle className="w-4 h-4" />
                          )}
                          {coupon.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>

                      <Separator />

                      {/* Coupon Code */}
                      <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl p-4 border-2 border-rose-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Tag className="w-5 h-5 text-rose-600" />
                            <div>
                              <p className="text-xs text-gray-600 font-medium">Coupon Code</p>
                              <p className="text-2xl font-black text-rose-600 tracking-wider">{coupon.code}</p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCopyCode(coupon.code)}
                            className="border-2 border-rose-300 hover:bg-rose-100 transition-colors"
                          >
                            <Copy className="w-4 h-4 mr-1" />
                            {copiedCode === coupon.code ? "Copied!" : "Copy"}
                          </Button>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 bg-purple-50 rounded-lg p-3 border border-purple-200">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Percent className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Discount</p>
                            <p className="text-lg font-black text-purple-600">{coupon.discountPercentage}%</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 bg-blue-50 rounded-lg p-3 border border-blue-200">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Expires</p>
                            <p className="text-sm font-bold text-blue-600">
                              {coupon.expiryDate ? coupon.expiryDate.split("T")[0] : "No expiry"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Created Date */}
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>Created: {coupon.createdAt?.split("T")[0]}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 pt-2">
                        <Button
                          onClick={() => handleEdit(coupon)}
                          className="flex-1 group/btn bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                        >
                          <Edit className="w-4 h-4 group-hover/btn:rotate-12 transition-transform duration-300" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(coupon._id)}
                          className="flex-1 group/btn bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                        >
                          <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog for Add/Edit */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-md rounded-2xl border-2 border-rose-100">
          <DialogHeader className="pb-4 border-b-2 border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                {editCoupon ? <Edit className="w-6 h-6 text-white" /> : <Plus className="w-6 h-6 text-white" />}
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-rose-900 to-pink-900 bg-clip-text text-transparent">
                  {editCoupon ? "Edit Coupon" : "Create New Coupon"}
                </DialogTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {editCoupon ? "Update coupon details" : "Fill in the coupon information"}
                </p>
              </div>
            </div>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-5 pt-4">
            <div>
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Gift className="w-4 h-4 text-rose-600" />
                Coupon Name
              </Label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Summer Sale"
                className="mt-2 border-2 border-gray-200 focus:border-rose-400 rounded-lg h-11"
                required
              />
            </div>

            <div>
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Tag className="w-4 h-4 text-rose-600" />
                Coupon Code
              </Label>
              <Input
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="e.g., SUMMER2024"
                className="mt-2 border-2 border-gray-200 focus:border-rose-400 rounded-lg h-11 uppercase"
                required
              />
            </div>

            <div>
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Percent className="w-4 h-4 text-rose-600" />
                Discount Percentage
              </Label>
              <Input
                type="number"
                name="discountPercentage"
                value={formData.discountPercentage}
                onChange={handleChange}
                placeholder="e.g., 20"
                min="1"
                max="100"
                className="mt-2 border-2 border-gray-200 focus:border-rose-400 rounded-lg h-11"
                required
              />
            </div>

            <div>
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-rose-600" />
                Expiry Date (Optional)
              </Label>
              <Input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className="mt-2 border-2 border-gray-200 focus:border-rose-400 rounded-lg h-11"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpenDialog(false)}
                className="flex-1 border-2 border-gray-300 hover:bg-gray-100 rounded-lg h-11 font-semibold"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="flex-1 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white rounded-lg h-11 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {editCoupon ? "Update Coupon" : "Create Coupon"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-30px) translateX(20px);
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

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes pulse-subtle {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
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

        .animate-float-slow {
          animation: float-slow ease-in-out infinite;
        }

        .animate-slide-down {
          animation: slide-down 0.6s ease-out;
        }

        .animate-slide-in {
          animation: slide-in 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-scale-in {
          animation: scale-in 0.5s ease-out forwards;
          opacity: 0;
        }

        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default AdminCouponsView;