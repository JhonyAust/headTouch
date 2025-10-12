import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Check } from "lucide-react";


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

import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { openLoginPopup } from "@/store/loginRegister-slice";

import ProductThumbnails from "@/components/shopping-view/ProductThumbnails";



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
    if (id) {
      dispatch(fetchProductDetails(id));
      dispatch(getReviews(id));
    }
  }, [dispatch, id]);

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
      } else {
        console.error("❌ Wishlist toggle failed:", resultAction.error);
      }
    } catch (err) {
      console.error("❌ Error toggling wishlist:", err);
    }
  } else {
    dispatch(toggleLocalWishlistItem(productDetails._id));
    console.log("🧪 Guest: toggled wishlist item");
  }

  toast({
    title: isWishlisted ? "Removed from Wishlist" : "Added to Wishlist",
  });
};




  const handleAddReview = () => {
    dispatch(
      addReview({
        productId: productDetails._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((res) => {
      if (res.payload.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails._id));
        toast({ title: "Review submitted" });
      }
    });
  };

  if (!productDetails) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-6 py-10 mt-12 sm:mt-0">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <div className="border overflow-hidden rounded mb-3">
            <ProductMagnifier src={selectedImage} zoom={2.5} />
          </div>
          <ProductThumbnails
            images={productDetails?.images || []}
            selectedImage={selectedImage}
            onSelectImage={setSelectedImage}
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{productDetails.title}</h1>

          <div className="flex gap-4 mb-4">
            <span className="text-muted-foreground text-[#565959]">
              Category :  {categoryOptionsMap[productDetails.category]}
            </span>
            <span >
            </span>
          </div>

          <div className="flex items-center gap-20 mb-4">
            <span
              className={`text-xl text-[#565959] ${
                productDetails.salePrice > 0 ? "line-through" : ""
              }`}
            >
              ৳ {productDetails.price}
            </span>
            {productDetails.salePrice > 0 && (
              <span className="text-2xl font-bold text-black">
                ৳ {productDetails.salePrice}
              </span>
            )}
          </div>

          <div className="mb-4">
            {productDetails.totalStock > 0 ? (
              <span className="text-green-600">In stock</span>
            ) : (
              <span className="text-red-600">Out of stock</span>
            )}
          </div>

          {productDetails.totalStock > 0 && (
            <div className="mb-4">


              <div className="mb-4 flex flex-col">
               <div className="flex items-center pb-6 gap-4"> 
                <Label>Quantity</Label>
                <div className="flex  items-center gap-4">
                  <Button variant="outline" size="icon" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                    -
                  </Button>
                  <span className="font-semibold">{quantity}</span>
                  <Button variant="outline" size="icon" onClick={() => setQuantity((q) => q + 1)}>
                    +
                  </Button>
                </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 ">
                    <Button
                      className=" flex-1  text-[11px]
    inline-flex items-center justify-center
    rounded-md border border-transparent
    bg-[linear-gradient(110deg,#EE751A_45%,#F5A05C_55%,#EE751A_100%)]
    bg-[length:200%_100%]
    animate-shimmer
    font-medium text-white
    transition-all
    focus:outline-none focus:ring-2 focus:ring-orange-400
    focus:ring-offset-2 focus:ring-offset-slate-50"
                      onClick={() => handleAddtoCart(productDetails._id)}
                    >
                      Add to Cart
                    </Button>
                    <Button
                  className="
  flex-1 text-[11px]
  inline-flex items-center justify-center
  rounded-md border border-transparent
  bg-[linear-gradient(110deg,#2563EB_0%,#EC4899_100%)]
  font-medium text-white
  transition-all duration-300
  hover:opacity-90
  focus:outline-none focus:ring-2 focus:ring-pink-400
  focus:ring-offset-2 focus:ring-offset-slate-50
"


                      onClick={() => handleBuyNow(productDetails._id)}
                    >
                      Buy Now
                    </Button>
                  </div>

              </div>
            </div>
          )}

          <div className="flex items-center gap-2 mb-6 mt-4">
              {isWishlisted ? (
                <Button
                  variant="outline"
                  className="w-full mt-3 flex items-center justify-center gap-2 text-green-600 border-green-600"
                  onClick={() => navigate("/shop/wishlist")}
                >
                  <Check className="w-5 h-5" />
                  Browse Wishlist
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="w-full mt-3 flex items-center justify-center gap-2"
                  onClick={handleToggleWishlist}
                >
                  <Heart className="w-5 h-5" />
                  Add to Wishlist
                </Button>
              )}
          </div>

          <div className="flex items-center gap-2 mb-6">
            <StarRatingComponent rating={averageReview} />
            <span className="text-muted-foreground">({averageReview.toFixed(2)})</span>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-2">Related Products</h2>
          {productList
            .filter((p) => p._id !== productDetails._id)
            .slice(0, 6)
            .map((item) => (
              <div
                key={item._id}
                className="flex gap-3 items-center p-2 border rounded hover:bg-gray-50 cursor-pointer"
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
                  className="w-14 h-14 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground">৳ {item.salePrice > 0 ? item.salePrice : item.price}</p>
                </div>
              </div>
            ))}
        </div>
      </div>

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
  );
}

export default ProductDetails;
