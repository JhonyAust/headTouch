import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import { getFeatureImages } from "@/store/common-slice";
import { addItem } from "@/store/shop/cart-slice-local";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, Sparkles, TrendingUp, Tag, Star, Zap, ShoppingBag } from "lucide-react";

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [featuredList, setFeaturedList] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [discountList, setDiscountList] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    // Featured
    dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParams: "price-lowtohigh" }))
      .then((res) => res?.payload?.data && setFeaturedList(res.payload.data));

    // New Arrivals
    dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParams: "newest" }))
      .then((res) => res?.payload?.data && setNewArrivals(res.payload.data));

    // All Products
    dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParams: "" }))
      .then((res) => {
        if (res?.payload?.data) {
          setAllProducts(res.payload.data);
          const discount = res.payload.data.filter((item) => item?.salePrice > 0);
          setDiscountList(discount);
        }
      });

    dispatch(getFeatureImages());
  }, [dispatch]);

  function handleAddtoCart(getCurrentProductId, quantity) {
    const product =
      allProducts.find((p) => p._id === getCurrentProductId) ||
      featuredList.find((p) => p._id === getCurrentProductId) ||
      newArrivals.find((p) => p._id === getCurrentProductId) ||
      discountList.find((p) => p._id === getCurrentProductId);

    if (!user) {
      dispatch(
        addItem({
          productId: product._id,
          title: product.title,
          price: product.price,
          salePrice: product.salePrice,
          image: product.images[0],
          quantity,
        })
      );
      toast({ title: "Product added to cart (Guest)" });
      return;
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity,
        image: product.images[0],
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({ title: "Product added to cart" });
      }
    });
  }

  function handleNavigateToProductDetails(product) {
    const categorySlug = product?.category || "unknown";
    const titleSlug = product?.title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
    navigate(`/shop/product/${categorySlug}/${titleSlug}-${product?._id}`);
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [featureImageList]);

  return (
    <div className="flex flex-col min-h-screen mt-14 md:mt-0 bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
      {/* Enhanced Banner with Parallax Effect */}
      <div className="relative w-full h-[250px] md:h-[600px] overflow-hidden group">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
        
        {/* Animated Background Particles */}
        <div className="absolute inset-0 z-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>

        {featureImageList?.length > 0 &&
          featureImageList.map((slide, index) => (
            <img
              src={slide?.image}
              key={index}
              className={`${
                index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-110"
              } absolute top-0 left-0 w-full h-full object-cover transition-all duration-1000 ease-out`}
            />
          ))}

        {/* Modern Slide Controls */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
          {featureImageList.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-500 ${
                currentSlide === index 
                  ? "w-12 h-3 bg-white rounded-full" 
                  : "w-3 h-3 bg-white/50 rounded-full hover:bg-white/80"
              }`}
            />
          ))}
        </div>

      </div>

      {/* Featured Products Section (Desktop) */}
      <section className="hidden md:block py-16 bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #9333ea 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-1 h-8 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></div>
                <Star className="w-6 h-6 text-purple-600" />
                <span className="text-sm font-semibold text-purple-600 uppercase tracking-wider">Premium Selection</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-900 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Featured Products
              </h2>
            </div>
            <Button 
              onClick={() => navigate("/shop/listing")}
              variant="outline" 
              className="hidden lg:flex items-center gap-2 border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <HorizontalScroll
            products={featuredList}
            handleNavigateToProductDetails={handleNavigateToProductDetails}
            handleAddtoCart={handleAddtoCart}
            emptyMessage="No featured products available."
          />
        </div>
      </section>

      {/* Mobile Tabs */}
      <section className="md:hidden">
        <div className="container mx-auto px-0">
          <Tabs defaultValue="features" className="w-full">
            <TabsList className="flex w-full bg-[#1A1A1A] overflow-hidden !rounded-none">
              <TabsTrigger
                value="features"
                className="flex-1 py-3 text-center text-sm font-semibold text-[#FFD700] transition-all
                hover:bg-[#2B2B2B] hover:text-white 
                data-[state=active]:bg-[#333333] data-[state=active]:text-white"
              >
                Features
              </TabsTrigger>

              <TabsTrigger
                value="new"
                className="flex-1 py-3 text-center text-sm font-semibold text-[#00D8FF] transition-all
                hover:bg-[#2B2B2B] hover:text-white 
                data-[state=active]:bg-[#333333] data-[state=active]:text-white"
              >
                New Arrival
              </TabsTrigger>

              <TabsTrigger
                value="discount"
                className="flex-1 py-3 text-center text-sm font-semibold text-[#FF6B6B] transition-all
                hover:bg-[#2B2B2B] hover:text-white 
                data-[state=active]:bg-[#333333] data-[state=active]:text-white"
              >
                Discount
              </TabsTrigger>
            </TabsList>

            <div className="bg-white mt-4 rounded-xl shadow-sm px-4">
              <TabsContent value="features" className="mt-0">
                <HorizontalScroll
                  products={featuredList}
                  handleNavigateToProductDetails={handleNavigateToProductDetails}
                  handleAddtoCart={handleAddtoCart}
                  emptyMessage="No features available."
                />
              </TabsContent>

              <TabsContent value="new" className="mt-0">
                <HorizontalScroll
                  products={newArrivals}
                  handleNavigateToProductDetails={handleNavigateToProductDetails}
                  handleAddtoCart={handleAddtoCart}
                  emptyMessage="No new arrivals found."
                />
              </TabsContent>

              <TabsContent value="discount" className="mt-0">
                <HorizontalScroll
                  products={discountList}
                  handleNavigateToProductDetails={handleNavigateToProductDetails}
                  handleAddtoCart={handleAddtoCart}
                  emptyMessage="No discount products available."
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </section>

      {/* All Products Section */}
      <section className="py-16 bg-white relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-cyan-600 rounded-full"></div>
                <ShoppingBag className="w-6 h-6 text-blue-600" />
                <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Explore More</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-900 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                All Products
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {allProducts?.length > 0 ? (
              (showAll ? allProducts : allProducts.slice(0, 12)).map((productItem, index) => (
                <div 
                  key={productItem._id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <ShoppingProductTile
                    handleGetProductDetails={handleNavigateToProductDetails}
                    product={productItem}
                    handleAddtoCart={handleAddtoCart}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">No products found.</p>
              </div>
            )}
          </div>

          {allProducts.length > 12 && !showAll && (
            <div className="flex justify-center mt-12">
              <Button 
                onClick={() => setShowAll(true)}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Load More Products
              </Button>
            </div>
          )}
        </div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

/* Enhanced Horizontal Scroll Component */
function HorizontalScroll({ products, handleNavigateToProductDetails, handleAddtoCart, emptyMessage }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScroll);
      return () => scrollElement.removeEventListener('scroll', checkScroll);
    }
  }, [products]);

  return (
    <div className="relative group">
      {/* Left Navigation Button */}
      {canScrollLeft && (
        <button
          onClick={() => scrollRef.current.scrollBy({ left: -350, behavior: "smooth" })}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full bg-white shadow-xl hover:shadow-2xl border border-gray-100 transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
      )}

      {/* Right Navigation Button */}
      {canScrollRight && (
        <button
          onClick={() => scrollRef.current.scrollBy({ left: 350, behavior: "smooth" })}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full bg-white shadow-xl hover:shadow-2xl border border-gray-100 transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-5 scrollbar-hide scroll-smooth px-1 py-2"
      >
        {products?.length > 0 ? (
          products.map((productItem, index) => (
            <div 
              key={productItem._id} 
              className="w-[160px] sm:w-[200px] md:min-w-[280px] shrink-0 animate-slide-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ShoppingProductTile
                handleGetProductDetails={handleNavigateToProductDetails}
                product={productItem}
                handleAddtoCart={handleAddtoCart}
              />
            </div>
          ))
        ) : (
          <div className="w-full text-center py-12">
            <TrendingUp className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">{emptyMessage}</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slide-in {
          animation: slide-in 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}

export default ShoppingHome;