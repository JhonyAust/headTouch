import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Check, ShoppingCart, Zap, Package, Shield, TrendingUp, Star, ChevronRight } from "lucide-react";

import ProductDetailsTabs from "@/components/shopping-view/ProductDetailsTabs";
import ProductMagnifier from "@/components/shopping-view/product-magnifier";
import StarRatingComponent from "@/components/common/star-rating";
import {
  fetchProductDetails,
  fetchAllFilteredProducts,
} from "@/store/shop/products-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { addItem } from "@/store/shop/cart-slice-local";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { useToast } from "@/components/ui/use-toast";

import { toggleLocalWishlistItem } from "@/store/shop/wishlist-slice-local";
import { toggleWishlistItem } from "@/store/shop/wishlist-slice";

import {  categoryOptionsMap } from "@/config";
import { openLoginPopup } from "@/store/loginRegister-slice";

import ProductThumbnails from "@/components/shopping-view/ProductThumbnails";
import { trackAddToCart, trackViewContent, trackAddToWishlist } from "@/components/utils/facebookPixel";
function ProductDetails() {
  const { slug } = useParams();
  const id = slug?.split("-").pop();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { productDetails, productList } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);
  const { reviews } = useSelector((state) => state.shopReview);

  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    window.scrollTo(0, 0);
    setQuantity(1); // Reset quantity when product changes
    setSelectedSize(""); // Reset size selection
    setRating(0); // Reset rating
    setReviewMsg(""); // Reset review message
    if (id) {
      dispatch(fetchProductDetails(id));
      dispatch(getReviews(id));
    }
  }, [dispatch, id]);

useEffect(() => {
  if (productDetails) {
    trackViewContent(productDetails);
  }
}, [productDetails]);
  useEffect(() => {
    if (productDetails?.category) {
      dispatch(
        fetchAllFilteredProducts({
          filterParams: { category: [productDetails.category] },
          sortParams: "price-lowtohigh",
        })
      );
    }

    if (productDetails?.images?.length) {
      setSelectedImage(productDetails.images[0]);
    }
  }, [dispatch, productDetails?.category, productDetails?.images]);

  const averageReview =
    reviews?.length > 0
      ? reviews.reduce((sum, r) => sum + r.reviewValue, 0) / reviews.length
      : 0;

  function handleAddtoCart(productId) {
    if (!productId) return toast({ title: "Invalid product ID", variant: "destructive" });
    trackAddToCart(productDetails, quantity); 
    const payload = { productId, size: selectedSize, quantity };
    if (user) {
      dispatch(addToCart({ userId: user.id, ...payload })).then((res) => {
        if (res.payload?.success) dispatch(fetchCartItems(user.id));
      });
    } else {
      dispatch(
        addItem({
          ...payload,
          title: productDetails.title,
          price: productDetails.price,
          salePrice: productDetails.salePrice,
          image: selectedImage,
        })
      );
    }

    toast({ title: "Product added to cart" });
  }

  function handleBuyNow(productId) {
    if (!productId) return toast({ title: "Invalid product ID", variant: "destructive" });

    const payload = { productId, size: selectedSize, quantity };

    if (user) {
      dispatch(addToCart({ userId: user.id, ...payload })).then((res) => {
        if (res.payload?.success) {
          dispatch(fetchCartItems(user.id));
          navigate("/shop/checkout");
        }
      });
    } else {
      dispatch(
        addItem({
          ...payload,
          title: productDetails.title,
          price: productDetails.price,
          salePrice: productDetails.salePrice,
          image: selectedImage,
        })
      );
      navigate("/shop/checkout");
    }

    toast({ title: "Product added to cart" });
  }

  const localWishlistItems = useSelector((state) => state.localWishlist.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const isWishlisted = user
    ? Array.isArray(wishlistItems) && wishlistItems.some((item) => item && item._id === productDetails?._id)
    : Array.isArray(localWishlistItems) && localWishlistItems.includes(productDetails?._id);

  const handleToggleWishlist = async () => {
    if (!productDetails?._id) return;

    if (user) {
      if (!user?.id) {
        console.log("❌ Missing userId");
        return;
      }

      try {
        const resultAction = await dispatch(
          toggleWishlistItem({ userId: user.id, productId: productDetails._id })
        );

        if (toggleWishlistItem.fulfilled.match(resultAction)) {
          console.log("🎉 Wishlist updated:", resultAction.payload.products);
           if (!isWishlisted) {
          trackAddToWishlist(productDetails);
        }
        } else {
          console.error("❌ Wishlist toggle failed:", resultAction.error);
        }
      } catch (err) {
        console.error("❌ Error toggling wishlist:", err);
      }
    } else {
      dispatch(toggleLocalWishlistItem(productDetails._id));
      console.log("🧪 Guest: toggled wishlist item");
       if (!isWishlisted) {
          trackAddToWishlist(productDetails);
        }
    }

    toast({
      title: isWishlisted ? "Removed from Wishlist" : "Added to Wishlist",
    });
  };

const handleAddReview = () => {
    if (!user) {
      dispatch(openLoginPopup());
      toast({ 
        title: "🔐 Sign In Required", 
        description: "Please sign in to submit a review",
        variant: "destructive" 
      });
      return;
    }

    if (!rating) {
      toast({ 
        title: "⭐ Rating Required", 
        description: "Please select a star rating before submitting",
        variant: "destructive" 
      });
      return;
    }

    if (!reviewMsg.trim()) {
      toast({ 
        title: "✍️ Review Message Required", 
        description: "Please write your review before submitting",
        variant: "destructive" 
      });
      return;
    }

    dispatch(
      addReview({
        productId: productDetails._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((res) => {
      // Check if the action was fulfilled (success)
      if (addReview.fulfilled.match(res)) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails._id));
        toast({ 
          title: res?.payload?.message || "🎉 Review Submitted Successfully!",
          description: "Thank you for sharing your feedback",
          className: "bg-green-50 border-green-200"
        });
      } 
      // Check if the action was rejected (error)
      else if (addReview.rejected.match(res)) {
        const errorMessage = res?.payload?.message || "❌ Failed to submit review";
        
        toast({ 
          title: errorMessage,
          description: "Please check the requirements and try again",
          variant: "destructive",
          duration: 5000
        });
      }
    }).catch((error) => {
      console.error("Review submission error:", error);
      toast({ 
        title: "❌ Network Error", 
        description: "Something went wrong. Please check your connection and try again.",
        variant: "destructive",
        duration: 5000
      });
    });
  };

  // Calculate discount percentage
  const discountPercentage = productDetails?.salePrice > 0 
    ? Math.round(((productDetails.price - productDetails.salePrice) / productDetails.price) * 100)
    : 0;

  if (!productDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 py-10 mt-16 md:mt-0">
      <div className="container mx-auto px-4 md:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <span onClick={() => navigate('/shop/home')} className="hover:text-purple-600 cursor-pointer">Home</span>
          <ChevronRight className="w-4 h-4" />
          <span onClick={() => navigate('/shop/listing')} className="hover:text-purple-600 cursor-pointer">Products</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-purple-600 font-medium">{productDetails.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <div className="bg-white border-2 border-gray-100 overflow-hidden rounded-2xl mb-4 shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <ProductMagnifier src={selectedImage} zoom={2.5} />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                  {productDetails?.totalStock === 0 && (
                    <span className="bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      Out of Stock
                    </span>
                  )}
                  {productDetails?.totalStock > 0 && productDetails?.totalStock < 10 && (
                    <span className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                      Only {productDetails.totalStock} left!
                    </span>
                  )}
                  {productDetails?.salePrice > 0 && (
                    <span className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      {discountPercentage}% OFF
                    </span>
                  )}
                </div>
              </div>
              <ProductThumbnails
                images={productDetails?.images || []}
                selectedImage={selectedImage}
                onSelectImage={setSelectedImage}
              />
            </div>
          </div>

          {/* Product Info Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
              {/* Category Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 rounded-full mb-4">
                <Package className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-semibold text-purple-600">
                  {categoryOptionsMap[productDetails.category]}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                {productDetails.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-1">
                  <StarRatingComponent rating={averageReview} />
                </div>
                <span className="text-gray-600 font-medium">
                  {averageReview.toFixed(1)} ({reviews?.length || 0} reviews)
                </span>
              </div>

              {/* Price Section */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mb-6">
                <div className="flex items-end gap-4">
                  {productDetails.salePrice > 0 ? (
                    <>
                      <div className="flex flex-col">
                        <span className="text-xl md:text-2xl font-bold text-gray-900">
                          ৳{productDetails.salePrice}
                        </span>
                        <span className="text-lg text-gray-500 line-through">
                          ৳{productDetails.price}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full mb-2">
                        Save ৳{productDetails.price - productDetails.salePrice}
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl md:text-3xl font-bold text-gray-900">
                      ৳{productDetails.price}
                    </span>
                  )}
                </div>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {productDetails.totalStock > 0 ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <Check className="w-5 h-5" />
                    <span className="font-semibold">In Stock</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600">
                    <span className="w-5 h-5">✕</span>
                    <span className="font-semibold">Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              {productDetails.totalStock > 0 && (
                <div className="mb-6">
                  <Label className="text-base font-semibold text-gray-900 mb-3 block">
                    Quantity
                  </Label>
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-10 h-10 rounded-full border-2 hover:border-purple-400 hover:bg-purple-50"
                    >
                      <span className="text-xl">-</span>
                    </Button>
                    <span className="text-2xl font-bold text-gray-900 min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-10 h-10 rounded-full border-2 hover:border-purple-400 hover:bg-purple-50"
                    >
                      <span className="text-xl">+</span>
                    </Button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {productDetails.totalStock > 0 && (
                <div className="space-y-3 mb-6">
                  <Button
                    className="w-full h-10 text-base 
                    inline-flex items-center justify-center gap-2
                    rounded-xl border border-transparent
                    bg-[linear-gradient(110deg,#EE751A_45%,#F5A05C_55%,#EE751A_100%)]
                    bg-[length:200%_100%]
                    animate-shimmer
                    text-white
                    transition-all duration-300
                    hover:shadow-xl
                    focus:outline-none focus:ring-2 focus:ring-orange-400"
                    onClick={() => handleAddtoCart(productDetails._id)}
                  >
                    <ShoppingCart className="w-3 h-3" />
                    Add to Cart
                  </Button>

                  <Button
                    className="w-full h-10 text-base 
                    inline-flex items-center justify-center gap-2
                    rounded-xl border border-transparent
                    bg-gradient-to-r from-blue-600 to-purple-600
                    text-white
                    transition-all duration-300
                    hover:shadow-xl hover:scale-[1.02]
                    focus:outline-none focus:ring-2 focus:ring-purple-400"
                    onClick={() => handleBuyNow(productDetails._id)}
                  >
                    <Zap className="w-3 h-3" />
                    Buy Now
                  </Button>
                </div>
              )}

              {/* Wishlist Button */}
              <div className="mb-6">
                {isWishlisted ? (
                  <Button
                    variant="outline"
                    className="w-full h-12 flex items-center justify-center gap-2 text-green-600 border-2 border-green-600 hover:bg-green-50 rounded-xl font-semibold"
                    onClick={() => navigate("/shop/wishlist")}
                  >
                    <Check className="w-5 h-5" />
                    Browse Wishlist
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full h-12 flex items-center justify-center gap-2 border-2 hover:border-purple-400 hover:bg-purple-50 rounded-xl font-semibold"
                    onClick={handleToggleWishlist}
                  >
                    <Heart className="w-5 h-5" />
                    Add to Wishlist
                  </Button>
                )}
              </div>

              {/* Features */}
              <div className="space-y-3 pt-6 border-t">
                <div className="flex items-center gap-3 text-gray-700">
                  <Shield className="w-5 h-5 text-purple-600" />
                  <span className="text-sm">100% Authentic Product</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Package className="w-5 h-5 text-purple-600" />
                  <span className="text-sm">Fast Delivery Across Bangladesh</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <span className="text-sm">7 Days Return Policy</span>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                  Related Products
                </h2>
                <div className="space-y-3">
                  {productList
                    .filter((p) => p._id !== productDetails._id)
                    .slice(0, 6)
                    .map((item) => (
                      <div
                        key={item._id}
                        className="group flex gap-4 items-center p-3 border border-gray-100 rounded-xl hover:border-purple-200 hover:bg-purple-50/50 cursor-pointer transition-all duration-300 hover:shadow-md"
                        onClick={() =>
                          navigate(
                            `/shop/product/${item.category}/${item.title
                              .toLowerCase()
                              .replace(/ /g, "-")
                              .replace(/[^\w-]+/g, "")}-${item._id}`
                          )
                        }
                      >
                        <img
                          src={item.images?.[0] || item.image}
                          alt={item.title}
                          className="w-16 h-16 object-cover rounded-lg group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate text-gray-900 group-hover:text-purple-600">
                            {item.title}
                          </p>
                          <p className="text-sm font-bold text-purple-600">
                            ৳{item.salePrice > 0 ? item.salePrice : item.price}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-transform" />
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <ProductDetailsTabs
            productDetails={productDetails}
            reviews={reviews}
            rating={rating}
            setRating={setRating}
            reviewMsg={reviewMsg}
            setReviewMsg={setReviewMsg}
            handleAddReview={handleAddReview}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .animate-shimmer {
          animation: shimmer 3s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default ProductDetails;