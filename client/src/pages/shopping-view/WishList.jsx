import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchWishlist } from "@/store/shop/wishlist-slice";
import { fetchCartItems, addToCart } from "@/store/shop/cart-slice";
import { addItem } from "@/store/shop/cart-slice-local";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useToast } from "@/components/ui/use-toast";
import { Heart, Sparkles, ShoppingBag, ArrowRight, Stars, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";

function Wishlist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isVisible, setIsVisible] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const wishlistItems = useSelector((state) =>
    user ? state.wishlist.items : state.localWishlist.items
  );
  const { productList } = useSelector((state) => state.shopProducts);

  // Convert guest's wishlist (ids) to full products
  const wishlistProducts = user
    ? wishlistItems
    : productList.filter((product) => wishlistItems.includes(product._id));

  const handleAddtoCart = (productId, quantity, size) => {
    const product = productList.find((p) => p._id === productId);

    if (!user) {
      dispatch(
        addItem({
          productId: product._id,
          title: product.title,
          price: product.price,
          salePrice: product.salePrice,
          image: product.image,
          quantity,
          size,
        })
      );
      toast({ title: "Product added to cart (Guest)" });
      return;
    }

    dispatch(
      addToCart({
        userId: user._id,
        productId,
        quantity,
        size,
      })
    ).then((res) => {
      if (res?.payload?.success) {
        dispatch(fetchCartItems(user._id));
        toast({ title: "Product added to cart" });
      }
    });
  };

  const handleNavigateToProductDetails = (product) => {
    const categorySlug = product?.category || "unknown";
    const titleSlug = product?.title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");

    navigate(`/shop/product/${categorySlug}/${titleSlug}-${product._id}`);
  };

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );

    if (user && user._id) {
      dispatch(fetchWishlist(user._id));
    }

    setIsVisible(true);
  }, [dispatch, user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50/20  mt-12 sm:mt-0 mb-12 relative overflow-hidden">
      {/* Animated Background Hearts & Sparkles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(30)].map((_, i) => {
          const isHeart = i % 3 === 0;
          return (
            <div
              key={i}
              className={`absolute ${isHeart ? 'animate-float-heart' : 'animate-float-slow'}`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: isHeart ? '20px' : '12px',
                opacity: isHeart ? 0.15 : 0.3,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${8 + Math.random() * 6}s`,
                color: i % 4 === 0 ? '#f43f5e' : i % 4 === 1 ? '#ec4899' : i % 4 === 2 ? '#f97316' : '#fbbf24'
              }}
            >
              {isHeart ? '❤️' : '✨'}
            </div>
          );
        })}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Hero Header Section */}
        <div className={`text-center mb-12 pt-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {/* Animated Heart Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              {/* Pulse Rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-rose-400/20 animate-ping-slow"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center animation-delay-500">
                <div className="w-36 h-36 rounded-full bg-rose-400/10 animate-ping-slow"></div>
              </div>
              
              {/* Heart Icon */}
              <div className=" mt-6 sm:mt-0 relative w-16 h-16 bg-gradient-to-br from-rose-400 via-pink-500 to-rose-600 rounded-full flex items-center justify-center shadow-2xl animate-scale-in">
                <Heart className="w-8 h-8 text-white fill-white animate-heartbeat" strokeWidth={2} />
              </div>

              {/* Counter Badge */}
              {wishlistProducts && wishlistProducts.length > 0 && (
                <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg animate-bounce-in">
                  {wishlistProducts.length}
                </div>
              )}
            </div>
          </div>

          {/* Title Section */}
          <div className="animate-fade-in animation-delay-300">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-rose-600 animate-pulse" />
              <span className="text-rose-600 font-semibold text-sm uppercase tracking-wider">
                Your Favorites
              </span>
              <Sparkles className="w-5 h-5 text-rose-600 animate-pulse" />
            </div>
            <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-3">
              My Wishlist
            </h1>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              {wishlistProducts && wishlistProducts.length > 0
                ? `You have ${wishlistProducts.length} amazing ${wishlistProducts.length === 1 ? 'item' : 'items'} saved for later`
                : "Save your favorite items and never lose track of what you love"}
            </p>
          </div>
        </div>

        {/* Content Section */}
        {wishlistProducts && wishlistProducts.length === 0 ? (
          /* Empty Wishlist State */
          <div className={`flex flex-col items-center justify-center py-20 animate-fade-in ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '400ms' }}>
            {/* Animated Empty Icon */}
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-100 via-pink-100 to-purple-100 rounded-full blur-3xl opacity-60 animate-pulse-slow"></div>
              <div className="relative bg-gradient-to-br from-white to-rose-50/50 rounded-full p-12 border-2 border-rose-200/50 shadow-2xl backdrop-blur-sm">
                <Heart className="w-12 h-12 text-rose-300 stroke-2" />
              </div>
            </div>

            {/* Empty State Content */}
            <div className="text-center max-w-md">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">
                Your Wishlist is Empty
              </h2>
              <p className="text-slate-500 text-base leading-relaxed mb-8">
                Start exploring our amazing collection and save your favorite items. Click the heart icon on any product to add it here!
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate("/shop/listing")}
                  className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white hover:from-rose-600 hover:via-pink-600 hover:to-rose-700 h-12 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold group"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5" />
                    Start Shopping
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="mt-12 flex gap-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full bg-gradient-to-r from-rose-300 via-pink-300 to-purple-300 opacity-40 animate-bounce-subtle"
                  style={{ animationDelay: `${i * 150}ms` }}
                ></div>
              ))}
            </div>
          </div>
        ) : (
          /* Products Grid */
          <div className={`transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '400ms' }}>
            {/* Stats Card */}
            <div className="bg-gradient-to-r from-rose-50 via-pink-50 to-purple-50 rounded-2xl p-6 mb-8 border border-rose-200/50 shadow-md">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Gift className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Your Collection</h3>
                    <p className="text-sm text-slate-600">{wishlistProducts.length} items you absolutely love</p>
                  </div>
                </div>
                <Button
                  onClick={() => navigate("/shop/listing")}
                  variant="outline"
                  className="border-2 border-rose-300 text-rose-700 hover:bg-rose-50 hover:border-rose-400 rounded-xl h-10 px-5 font-semibold text-sm transition-all duration-300 group"
                >
                  <span className="flex items-center gap-2">
                    Explore More
                    <Stars className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  </span>
                </Button>
              </div>
            </div>

            {/* Products Grid with Staggered Animation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlistProducts.map((product, index) => (
                <div
                  key={product._id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <ShoppingProductTile
                    product={product}
                    handleAddtoCart={handleAddtoCart}
                    handleGetProductDetails={handleNavigateToProductDetails}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-25px) translateX(15px);
          }
          50% {
            transform: translateY(-50px) translateX(-15px);
          }
          75% {
            transform: translateY(-25px) translateX(15px);
          }
        }

        @keyframes float-heart {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          25% {
            transform: translateY(-20px) scale(1.1);
          }
          50% {
            transform: translateY(-40px) scale(1);
          }
          75% {
            transform: translateY(-20px) scale(0.9);
          }
        }

        @keyframes ping-slow {
          0% {
            transform: scale(0.8);
            opacity: 1;
          }
          80%, 100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        @keyframes scale-in {
          0% {
            transform: scale(0) rotate(-180deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.15) rotate(0deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        @keyframes heartbeat {
          0%, 100% {
            transform: scale(1);
          }
          10%, 30% {
            transform: scale(1.1);
          }
          20% {
            transform: scale(0.95);
          }
        }

        @keyframes bounce-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(25px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 0.9;
          }
        }

        .animate-float-slow {
          animation: float-slow ease-in-out infinite;
        }

        .animate-float-heart {
          animation: float-heart ease-in-out infinite;
        }

        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .animate-scale-in {
          animation: scale-in 0.7s ease-out;
        }

        .animate-heartbeat {
          animation: heartbeat 1.5s ease-in-out infinite;
        }

        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out 0.4s backwards;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
          opacity: 0;
        }

        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .animation-delay-500 {
          animation-delay: 0.5s;
        }
      `}</style>
    </div>
  );
}

export default Wishlist;