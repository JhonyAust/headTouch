import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { toggleLocalWishlistItem } from "@/store/shop/wishlist-slice-local";
import { toggleWishlistItem } from "@/store/shop/wishlist-slice";
import HeartToggle from "./HeartToggle";

function ShoppingProductTile({ product, handleGetProductDetails, handleAddtoCart }) {
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { toast } = useToast();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const localWishlistItems = useSelector((state) => state.localWishlist.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const isWishlisted = user
    ? Array.isArray(wishlistItems) && wishlistItems.some((item) => item && item._id === product._id)
    : Array.isArray(localWishlistItems) && localWishlistItems.includes(product._id);

  const handleToggleWishlist = async (e) => {
    e.stopPropagation();

    if (user) {
      if (!user?.id || !product?._id) {
        console.log("❌ Missing userId or productId");
        return;
      }

      try {
        const resultAction = await dispatch(
          toggleWishlistItem({ userId: user.id, productId: product._id })
        );

        if (toggleWishlistItem.fulfilled.match(resultAction)) {
          console.log("🎉 New wishlist products:", resultAction.payload.products);
        } else {
          console.error("❌ Wishlist toggle failed:", resultAction.error);
        }
      } catch (err) {
        console.error("❌ Toggle error:", err);
      }
    } else {
      dispatch(toggleLocalWishlistItem(product._id));
      console.log("🧪 Guest user: toggled local wishlist item");
    }

    toast({
      title: isWishlisted ? "Removed from Wishlist" : "Added to Wishlist",
    });
  };

  const addToCartHandler = (e) => {
    e.stopPropagation();
    handleAddtoCart(product?._id, 1);
  };

  const handleCardClick = () => {
    handleGetProductDetails(product);
  };

  // Calculate discount percentage
  const discountPercentage = product?.salePrice > 0 
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  return (
    <Card 
      className="group relative flex flex-col h-full w-full overflow-hidden bg-white hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Heart Toggle Button */}
      <div className="absolute top-3 right-3 z-20" onClick={(e) => e.stopPropagation()}>
        <HeartToggle isActive={isWishlisted} onClick={handleToggleWishlist} />
      </div>

      {/* Image Container - Fixed Height */}
      <div className="relative w-full h-36 sm:h-44 md:h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {/* Loading Skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
        )}
        
        {/* Product Image */}
        <img
          src={product?.images?.[0] ? product.images[0] : "/placeholder.png"}
          alt={product?.title}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-500 ${
            imageLoaded ? 'opacity-100 group-hover:scale-110' : 'opacity-0'
          }`}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {product?.totalStock === 0 ? (
            <Badge className="bg-gradient-to-r from-red-600 to-red-700 text-white border-0 shadow-lg text-xs font-semibold px-2.5 py-1">
              Out Of Stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="bg-gradient-to-r from-orange-600 to-red-600 text-white border-0 shadow-lg text-xs font-semibold px-2.5 py-1 animate-pulse">
              Only {product?.totalStock} left
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0 shadow-lg text-xs font-semibold px-2.5 py-1">
              {discountPercentage}% OFF
            </Badge>
          ) : null}
        </div>

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="text-white text-sm font-semibold tracking-wide">Quick View</div>
        </div>
      </div>

      {/* Content Container - Flex Grow */}
      <CardContent className="flex-grow flex flex-col p-3 sm:p-4 space-y-3">
        {/* Title - Fixed Height with Line Clamp */}
        <h2 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem] leading-tight">
          {product?.title}
        </h2>

        {/* Spacer */}
        <div className="flex-grow" />

        {/* Price Section */}
        <div className="flex items-end gap-2">
          {product?.salePrice > 0 ? (
            <>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold text-gray-900">
                  ৳{product?.salePrice}
                </span>
                <span className="text-xs sm:text-sm text-gray-500 line-through">
                  ৳{product?.price}
                </span>
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                Save ৳{product?.price - product?.salePrice}
              </span>
            </>
          ) : (
            <span className="text-lg sm:text-xl font-bold text-gray-900">
              ৳{product?.price}
            </span>
          )}
        </div>
      </CardContent>

      {/* Footer - Fixed Height */}
      <CardFooter className="p-3 sm:p-4 pt-0">
        {product?.totalStock === 0 ? (
          <Button 
            disabled
            className="w-full h-8 sm:h-10 bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300"
          >
            Out Of Stock
          </Button>
        ) : (
          <Button
            onClick={addToCartHandler}
            className="w-full h-8 sm:h-10 text-[11px] sm:text-sm
            inline-flex items-center justify-center gap-2
            rounded-md border border-transparent
            bg-[linear-gradient(110deg,#EE751A_45%,#F5A05C_55%,#EE751A_100%)]
            bg-[length:200%_100%]
            animate-shimmer
            font-semibold text-white
            transition-all
            focus:outline-none focus:ring-2 focus:ring-orange-400
            focus:ring-offset-2 focus:ring-offset-slate-50
            shadow-md hover:shadow-lg"
          >
            <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ADD TO CART
          </Button>
        )}
      </CardFooter>

      {/* Hover Border Effect */}
      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 rounded-lg border-2 border-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-border" 
             style={{ WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .animate-shimmer {
          animation: shimmer 3s linear infinite;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </Card>
  );
}

export default ShoppingProductTile;