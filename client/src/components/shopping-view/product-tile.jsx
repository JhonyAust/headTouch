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

const sizes = [
  { label: "S (34-36)", value: "S" },
  { label: "M (38-40)", value: "M" },
  { label: "L (40-42)", value: "L" },
];

function ShoppingProductTile({ product, handleGetProductDetails, handleAddtoCart }) {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
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



  const toggleOptions = () => setShowOptions((prev) => !prev);

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
    if (!selectedSize) {
      toast({
        title: "Please select a size before adding to cart",
        variant: "destructive",
      });
      return;
    }
    handleAddtoCart(product?._id, quantity, selectedSize);
    setShowOptions(false);
  };

  return (
    <Card className="w-full max-w-sm mx-auto overflow-hidden relative">
      {/* Heart Toggle Button */}
      <HeartToggle isActive={isWishlisted} onClick={handleToggleWishlist} />

      <div onClick={() => handleGetProductDetails(product)}>
        <div className="relative group">
          <img
            src={product?.images?.[0] ? product.images[0] : "/placeholder.png"}
            alt={product?.title}
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
        <CardContent className="p-2 sm:p-4">
          <h2 className="text-md truncate" style={{ maxWidth: "100%" }}>
            {product?.title}
          </h2>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[15px] text-muted-foreground">
              {categoryOptionsMap[product?.category]}
            </span>
            <span className="text-[15px] text-muted-foreground">
              {brandOptionsMap[product?.brand]}
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span
              className={`text-md font-semibold text-[#8F8933] ${
                product?.salePrice > 0 ? "line-through" : ""
              }`}
            >
              ৳ {product?.price}
            </span>
            {product?.salePrice > 0 && (
              <span className="text-md font-semibold text-[#8F8933]">
                ৳ {product?.salePrice}
              </span>
            )}
          </div>
        </CardContent>
      </div>

      <CardFooter>
        {product?.totalStock === 0 ? (
          <Button className="w-full opacity-60 cursor-not-allowed">Out Of Stock</Button>
        ) : (
          <Button onClick={toggleOptions} className="w-full bg-ds_orange hover:bg-ds_orange_hover">
            ADD TO CART
          </Button>
        )}
      </CardFooter>

      <AnimatePresence>
        {showOptions && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-white bg-opacity-35 backdrop-blur-md z-20 p-1 sm:p-4 rounded-lg flex flex-col justify-between"
          >
            <div className="flex justify-between items-start mb-6 mt-16">
              <div className="flex-1 flex justify-center">
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-5/6 border-2 border-[#918E8F] rounded px-3 py-2 text-center text-[#918E8F] font-medium text-base"
                >
                  <option value="">Choose an option</option>
                  {sizes.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowOptions(false);
                  setQuantity(1);
                }}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex items-center justify-between px-8 mb-8 gap-2">
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <span className="font-semibold text-sm ">{quantity}</span>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
              <Button
                className="bg-ds_orange hover:bg-ds_orange_hover px-2 py-2 text-sm sm:text-base"
                onClick={addToCartHandler}
              >
                Add
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

export default ShoppingProductTile;
