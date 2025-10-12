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
import { ChevronLeft, ChevronRight } from "lucide-react";

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

  useEffect(() => {
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
          // Discount products where salePrice > 0
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

  // Auto slide banner
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [featureImageList]);

  return (
    <div className="flex flex-col min-h-screen mt-14 md:mt-0">
      {/* Banner */}
      <div className="relative w-full h-[200px] md:h-[500px] overflow-hidden">
        {featureImageList?.length > 0 &&
          featureImageList.map((slide, index) => (
            <img
              src={slide?.image}
              key={index}
              className={`${
                index === currentSlide ? "opacity-100" : "opacity-0"
              } absolute top-0 left-0 w-full h-full object-fill transition-opacity duration-1000`}
            />
          ))}

        {/* Dot Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {featureImageList.map((_, index) => (
            <div
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-300 ${
                currentSlide === index ? "bg-ht_secondary scale-110" : "bg-gray-300"
              }`}
            ></div>
          ))}
        </div>
      </div>

      {/* Feature Products (Desktop) */}
      <section className="hidden md:block py-10 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <h2 className="text-3xl sm:text-4xl mb-6  text-ht_secondary">
            Feature Products
          </h2>
          <HorizontalScroll
            products={featuredList}
            handleNavigateToProductDetails={handleNavigateToProductDetails}
            handleAddtoCart={handleAddtoCart}
            emptyMessage="No featured products available."
          />
        </div>
      </section>

      {/* Tabs (Mobile) */}
<section className=" sm:hidden">
  <div className="container mx-auto px-0 ">
    <Tabs defaultValue="features" className="w-full">
      {/* Tabs Header */}
      <TabsList className="flex w-full  bg-[#1A1A1A] overflow-hidden !rounded-none">
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

      {/* Tabs Body */}
      <div className="bg-white mt-4 rounded-xl shadow-sm">
        <TabsContent value="features">
          <HorizontalScroll
            products={featuredList}
            handleNavigateToProductDetails={handleNavigateToProductDetails}
            handleAddtoCart={handleAddtoCart}
            emptyMessage="No features available."
          />
        </TabsContent>

        <TabsContent value="new">
          <HorizontalScroll
            products={newArrivals}
            handleNavigateToProductDetails={handleNavigateToProductDetails}
            handleAddtoCart={handleAddtoCart}
            emptyMessage="No new arrivals found."
          />
        </TabsContent>

        <TabsContent value="discount">
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


      {/* All Products */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <h2 className="text-3xl sm:text-4xl mb-6  text-ht_secondary">
            All Products
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {allProducts?.length > 0 ? (
              (showAll ? allProducts : allProducts.slice(0, 12)).map((productItem) => (
                <ShoppingProductTile
                  key={productItem._id}
                  handleGetProductDetails={handleNavigateToProductDetails}
                  product={productItem}
                  handleAddtoCart={handleAddtoCart}
                />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">No products found.</p>
            )}
          </div>

          {allProducts.length > 12 && !showAll && (
            <div className="flex justify-center mt-8">
              <Button onClick={() => setShowAll(true)}>Show More</Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

/* Horizontal Scroll Component */
function HorizontalScroll({ products, handleNavigateToProductDetails, handleAddtoCart, emptyMessage }) {
  const scrollRef = useRef(null);

  return (
    <div className="relative">
      {/* Left button - desktop only */}
      <button
        onClick={() => scrollRef.current.scrollBy({ left: -300, behavior: "smooth" })}
        className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-100"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Right button - desktop only */}
      <button
        onClick={() => scrollRef.current.scrollBy({ left: 300, behavior: "smooth" })}
        className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-100"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 scrollbar-hide scroll-smooth px-2"
        style={{ scrollbarWidth: "none" }}
      >
        {products?.length > 0 ? (
          products.map((productItem) => (
            <div key={productItem._id} className="w-1/2 sm:w-auto sm:min-w-[250px] shrink-0">
              <ShoppingProductTile
                handleGetProductDetails={handleNavigateToProductDetails}
                product={productItem}
                handleAddtoCart={handleAddtoCart}
              />
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 w-full">{emptyMessage}</p>
        )}
      </div>
    </div>
  );
}

export default ShoppingHome;
