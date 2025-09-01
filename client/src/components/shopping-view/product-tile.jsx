import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { toggleLocalWishlistItem } from "@/store/shop/wishlist-slice-local";
import { toggleWishlistItem } from "@/store/shop/wishlist-slice";
import HeartToggle from "./HeartToggle"; 


function ShoppingProductTile({ product, handleGetProductDetails, handleAddtoCart }) {
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const localWishlistItems = useSelector((state) => state.localWishlist.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);

 const isWishlisted = user
  ? Array.isArray(wishlistItems) && wishlistItems.some((item) =>item && item._id === product._id)
  : Array.isArray(localWishlistItems) && localWishlistItems.includes(product._id);
  console.log("Iswishlist",isWishlisted);

  const handleToggleWishlist = async (e) => {
  e.stopPropagation();

  if (user) {
    if (!user?.id || !product?._id) {
      console.log("❌ Missing userId or productId");
      return;
    }

    console.log("✅ Dispatching toggleWishlistItem with:", {
      userId: user.id,
      productId: product._id,
    });

    try {
      const resultAction = await dispatch(
        toggleWishlistItem({ userId: user.id, productId: product._id })
      );

      // Log the returned value
      console.log("✅ Wishlist toggle response:", resultAction);

      // If needed, extract the payload:
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


  const addToCartHandler = () => {
    handleAddtoCart(product?._id, 1);
  };

  return (
    <Card className="w-full max-w-sm mx-auto overflow-hidden relative">
      {/* Heart Toggle Button */}
      <HeartToggle isActive={isWishlisted} onClick={handleToggleWishlist} />

      <div >
        <div className="relative group">
          <img
            src={product?.images?.[0] ? product.images[0] : "/placeholder.png"}
            alt={product?.title}
            onClick={() => handleGetProductDetails(product)}
            className="w-full h-[200px] object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-110"
          />
          {product?.totalStock === 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Out Of Stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              {`Only ${product?.totalStock} items left`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Sale
            </Badge>
          ) : null}
        </div>
        <CardContent className="p-6 sm:p-4 ">
          <h2 className="text-xl font-semibold truncate" style={{ maxWidth: "100%" }}>
            {product?.title}
          </h2>
          <div className="flex justify-between items-center mt-6">
             <div className="flex-col mb-2">

             <div>
            {product?.salePrice > 0 && (
              <span className="text-lg font-semibold text-black">
                ৳ {product?.salePrice}
              </span>
            )}
            </div>
            <div>
            <span
              className={`text-xs font-semibold text-[#565959] ${
                product?.salePrice > 0 ? "line-through" : ""
              }`}
            >
              ৳ {product?.price}
            </span>
            </div>
           
          </div>
          <CardFooter>
        {product?.totalStock === 0 ? (
          <Button className="w-full opacity-60 cursor-not-allowed">Out Of Stock</Button>
        ) : (
          <Button onClick={addToCartHandler}  className="w-full p-2 text-xs bg-ds_orange hover:bg-ds_orange_hover text-white">
            ADD TO CART
          </Button>
        )}
      </CardFooter>


          </div>
         
        </CardContent>
      </div>

      
      
    </Card>
  );
}

export default ShoppingProductTile;
