import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { addProductFormElements } from "@/config";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  Plus, 
  Package, 
  Sparkles, 
  TrendingUp, 
  ShoppingBag,
  Grid3x3,
  LayoutGrid
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const initialFormData = {
  title: "",
  description: "",
  category: "",
  price: "",
  salePrice: "",
  totalStock: "",
  sizes: [],
  images: [],
  averageReview: 0,
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();

    const payload = {
      ...formData,
      images: uploadedImageUrls,
    };

    if (currentEditedId !== null) {
      dispatch(editProduct({ id: currentEditedId, formData: payload })).then(
        (data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setFormData(initialFormData);
            setUploadedImageUrls([]);
            setOpenCreateProductsDialog(false);
            setCurrentEditedId(null);
            toast({ title: "Product updated successfully" });
          }
        }
      );
    } else {
      dispatch(addNewProduct(payload)).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          setOpenCreateProductsDialog(false);
          setFormData(initialFormData);
          setUploadedImageUrls([]);
          toast({ title: "Product added successfully" });
        }
      });
    }
  }

  function handleDelete(getCurrentProductId) {
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        toast({ title: "Product deleted successfully" });
      }
    });
  }

  function isFormValid() {
    const requiredFields = [
      "title",
      "description",
      "category",
      "price",
      "salePrice",
      "totalStock",
    ];

    for (let field of requiredFields) {
      if (!formData[field] || formData[field].toString().trim() === "") {
        return false;
      }
    }

    if (!uploadedImageUrls || uploadedImageUrls.length === 0) {
      return false;
    }

    return true;
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  // Stats calculation
  const totalProducts = productList?.length || 0;
  const inStockProducts = productList?.filter(p => p.totalStock > 0).length || 0;
  const lowStockProducts = productList?.filter(p => p.totalStock > 0 && p.totalStock <= 10).length || 0;
  const totalValue = productList?.reduce((sum, p) => sum + (p.price * p.totalStock), 0) || 0;

  return (
    <Fragment>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20 p-4 md:p-8">
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
                background: i % 2 === 0 ? '#60a5fa' : '#a78bfa',
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
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse-subtle">
                <Package className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-900 via-purple-800 to-pink-700 bg-clip-text text-transparent">
                  Product Management
                </h1>
                <p className="text-gray-600 mt-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  Manage your entire product catalog
                </p>
              </div>
            </div>
            <Button 
              onClick={() => setOpenCreateProductsDialog(true)}
              className="group bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-700 hover:via-pink-700 hover:to-rose-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 h-14 px-8 rounded-xl text-base font-bold hover:scale-105"
            >
              <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              Add New Product
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="group bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-100 hover:border-blue-300 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden animate-slide-in" style={{ animationDelay: '0s' }}>
              <CardContent className="p-6 ">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <ShoppingBag className="w-6 h-6 text-white" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-blue-600 opacity-50" />
                </div>
                <p className="text-sm font-semibold text-blue-600 mb-1">Total Products</p>
                <p className="text-3xl font-black text-gray-900">{totalProducts}</p>
              </CardContent>
            </Card>

            <Card className="group bg-gradient-to-br from-green-50 to-emerald-50 border-2  border-green-100 hover:border-green-300 shadow-lg hover:shadow-2xl  transition-all duration-300 hover:-translate-y-2 overflow-hidden animate-slide-in" style={{ animationDelay: '0.1s' }}>
              <CardContent className="p-6 ">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <Sparkles className="w-5 h-5 text-green-600 opacity-50" />
                </div>
                <p className="text-sm font-semibold text-green-600 mb-1">In Stock</p>
                <p className="text-3xl font-black text-gray-900">{inStockProducts}</p>
              </CardContent>
            </Card>

            <Card className="group border-2 bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-100 hover:border-orange-300 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden animate-slide-in" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-6 ">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Grid3x3 className="w-6 h-6 text-white" />
                  </div>
                  <Sparkles className="w-5 h-5 text-orange-600 opacity-50" />
                </div>
                <p className="text-sm font-semibold text-orange-600 mb-1">Low Stock</p>
                <p className="text-3xl font-black text-gray-900">{lowStockProducts}</p>
              </CardContent>
            </Card>

            <Card className="group border-2 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100 hover:border-purple-300 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden animate-slide-in" style={{ animationDelay: '0.3s' }}>
              <CardContent className="p-6 ">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <Sparkles className="w-5 h-5 text-purple-600 opacity-50" />
                </div>
                <p className="text-sm font-semibold text-purple-600 mb-1">Inventory Value</p>
                <p className="text-2xl font-black text-gray-900">৳{totalValue.toLocaleString()}</p>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid Header */}
          <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-100 shadow-lg animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <LayoutGrid className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Product Catalog</h2>
                <p className="text-sm text-gray-600">Browse and manage all products</p>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 text-sm font-bold shadow-lg">
              {totalProducts} Items
            </Badge>
          </div>

          {/* Products Grid */}
          {productList && productList.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              {productList.map((productItem, index) => (
                <div
                  key={productItem._id}
                  className="animate-scale-in"
                  style={{ animationDelay: `${0.6 + index * 0.05}s` }}
                >
                  <AdminProductTile
                    product={productItem}
                    setFormData={setFormData}
                    setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                    setCurrentEditedId={setCurrentEditedId}
                    setUploadedImageUrls={setUploadedImageUrls}
                    handleDelete={handleDelete}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-50 animate-pulse-slow"></div>
                <div className="relative bg-gradient-to-br from-white to-blue-50/50 rounded-full p-12 border-2 border-blue-200/50 shadow-2xl">
                  <Package className="w-24 h-24 text-blue-300" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">No Products Yet</h3>
              <p className="text-gray-500 text-base mb-8 max-w-md text-center leading-relaxed">
                Start building your product catalog by adding your first product
              </p>
              <Button 
                onClick={() => setOpenCreateProductsDialog(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 h-12 px-8 rounded-xl font-semibold hover:scale-105"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Product
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Sheet for Add/Edit Product */}
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
          setUploadedImageUrls([]);
        }}
      >
        <SheetContent side="right" className="overflow-auto w-full sm:max-w-xl bg-gradient-to-br from-white to-purple-50/20">
          <SheetHeader className="pb-6 border-b-2 border-purple-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                {currentEditedId !== null ? (
                  <Package className="w-6 h-6 text-white" />
                ) : (
                  <Plus className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-purple-900 to-pink-900 bg-clip-text text-transparent">
                  {currentEditedId !== null ? "Edit Product" : "Add New Product"}
                </SheetTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {currentEditedId !== null ? "Update product information" : "Fill in the details below"}
                </p>
              </div>
            </div>
          </SheetHeader>

          <div className="py-6 space-y-6">
            {/* Image Upload Section */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border-2 border-purple-100">
              <ProductImageUpload
                uploadedImageUrls={uploadedImageUrls}
                setUploadedImageUrls={setUploadedImageUrls}
              />
            </div>

            {/* Form Section */}
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Update Product" : "Add Product"}
              formControls={addProductFormElements}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>

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
            transform: scale(0.9);
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
    </Fragment>
  );
}

export default AdminProducts;