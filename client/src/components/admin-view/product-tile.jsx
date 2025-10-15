import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { 
  Edit, 
  Trash2, 
  Package, 
  Tag, 
  DollarSign,
  Sparkles,
  TrendingUp,
  AlertCircle
} from "lucide-react";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  setUploadedImageUrls,
  handleDelete,
}) {
  const isOnSale = product?.salePrice > 0;
  const discountPercent = isOnSale 
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;
  const isLowStock = product?.totalStock <= 10 && product?.totalStock > 0;
  const isOutOfStock = product?.totalStock === 0;

  return (
    <Card className="group w-full mx-auto flex flex-col h-full shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl border-2 border-gray-100 hover:border-purple-300 overflow-hidden hover:-translate-y-2 bg-gradient-to-br from-white to-purple-50/20">
      {/* Product Image with Overlay */}
      <div className="relative overflow-hidden">
        <img
          src={product?.images?.[0] ? product.images[0] : "/placeholder.png"}
          alt={product?.title}
          className="w-full h-[220px] object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isOnSale && (
            <Badge className="bg-gradient-to-r from-rose-600 to-pink-600 text-white px-3 py-1 font-bold shadow-lg animate-pulse-badge">
              <Tag className="w-3 h-3 mr-1" />
              {discountPercent}% OFF
            </Badge>
          )}
          {isOutOfStock && (
            <Badge className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-3 py-1 font-bold shadow-lg">
              <AlertCircle className="w-3 h-3 mr-1" />
              Out of Stock
            </Badge>
          )}
          {isLowStock && !isOutOfStock && (
            <Badge className="bg-gradient-to-r from-orange-600 to-yellow-600 text-white px-3 py-1 font-bold shadow-lg">
              <TrendingUp className="w-3 h-3 mr-1" />
              Low Stock
            </Badge>
          )}
        </div>

        {/* Stock Count Badge */}
        <div className="absolute top-3 right-3">
          <Badge className="bg-black/70 backdrop-blur-sm text-white px-3 py-1 font-semibold shadow-lg">
            <Package className="w-3 h-3 mr-1" />
            {product?.totalStock || 0}
          </Badge>
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-3 right-3">
          <Badge className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 font-semibold shadow-lg border border-gray-200">
            {product?.category || "Uncategorized"}
          </Badge>
        </div>
      </div>

      {/* Product Info */}
      <CardContent className="flex flex-col flex-grow p-5">
        <h3 className="text-md font-semibold text-gray-800 mb-3 line-clamp-2 group-hover:text-purple-700 transition-colors duration-300 min-h-[20px] truncate">
          {product?.title}
        </h3>

        {/* Price Section */}
        <div className="flex items-center justify-between gap-3 ">
          <div className="flex flex-col">
            {isOnSale ? (
              <>
                <span className="text-sm text-gray-500 line-through font-medium">
                  ৳{product?.price}
                </span>
                <div className="flex items-center gap-2">
                 
                  <span className="text-xl font-black text-green-600">
                    ৳{product?.salePrice}
                  </span>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <span className="text-2xl font-black text-blue-600">
                  ৳{product?.price}
                </span>
              </div>
            )}
          </div>

          {isOnSale && (
            <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full">
              <Sparkles className="w-4 h-4 text-green-600" />
              <span className="text-xs font-bold text-green-700">
                Save ৳{product?.price - product?.salePrice}
              </span>
            </div>
          )}
        </div>

      
      </CardContent>

      {/* Actions Footer */}
      <CardFooter className="flex gap-3 p-4">
        <Button
          className="flex-1 group/btn bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-2.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-xl flex items-center justify-center gap-2 hover:scale-105"
          onClick={() => {
            setOpenCreateProductsDialog(true);
            setCurrentEditedId(product?._id);
            setFormData(product);
            setUploadedImageUrls(product?.images || []);
          }}
        >
          <Edit className="w-4 h-4 group-hover/btn:rotate-12 transition-transform duration-300" />
          <span>Edit</span>
        </Button>

        <Button
          className="flex-1 group/btn bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-semibold py-2.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-xl flex items-center justify-center gap-2 hover:scale-105"
          onClick={() => handleDelete(product?._id)}
        >
          <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" />
          <span>Delete</span>
        </Button>
      </CardFooter>

      <style jsx>{`
        @keyframes pulse-badge {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.05);
          }
        }

        .animate-pulse-badge {
          animation: pulse-badge 2s ease-in-out infinite;
        }
      `}</style>
    </Card>
  );
}

export default AdminProductTile;