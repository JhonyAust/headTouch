import { Button } from "@/components/ui/button";
// import { motion } from "framer-motion"; 
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { SiNike, SiAdidas, SiPuma, SiZara } from "react-icons/si";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import { getFeatureImages } from "@/store/common-slice";
import premiumImage from "../../assets/cat.png";
import sportImage from "../../assets/cat4.png";
import classicImage from "../../assets/cat1.png";
import limitedImage from "../../assets/cat3.png";
import { addItem } from "@/store/shop/cart-slice-local";

const categoriesWithImages = [
  { id: "premium", label: "Premium", image: premiumImage },
  { id: "sport", label: "Sport Edition", image: sportImage },
  { id: "vintage", label: "Vintage", image: classicImage },
  { id: "limited", label: "Limited Edition", image: limitedImage },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList } = useSelector((state) => state.shopProducts);
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    // Fetch Featured Products
    dispatch(
      fetchAllFilteredProducts({ filterParams: {}, sortParams: "price-lowtohigh" })
    );

    // Fetch New Arrivals
    dispatch(
      fetchAllFilteredProducts({ filterParams: { category: ["new"] }, sortParams: "price-lowtohigh" })
    ).then((res) => {
      if (res?.payload?.data) setNewArrivals(res.payload.data);
    });

    dispatch(getFeatureImages());
  }, [dispatch]);

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = { [section]: [getCurrentItem.id] };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleAddtoCart(getCurrentProductId, quantity) {
    const product = productList.find((p) => p._id === getCurrentProductId);

    if (!user) {
      // Guest user: add to local cart
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
      } else {
        console.log("Fail", data);
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
    }, 15000);
    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParams: "price-lowtohigh" }));
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen mt-14 md:mt-0">
      {/* Banner */}
      <div className="relative w-full h-[200px] md:h-[500px] overflow-hidden">
        {featureImageList &&
          featureImageList.length > 0 &&
          featureImageList.map((slide, index) => (
            <img
              src={slide?.image}
              key={index}
              className={`${
                index === currentSlide ? "opacity-100" : "opacity-0"
              } absolute top-0 left-0 w-full h-full object-fill transition-opacity duration-1000`}
            />
          ))}
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide - 1 + featureImageList.length) % featureImageList.length
            )
          }
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length)
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>

      {/* Categories */}
      <section className="py-12 bg-gray-50">
        {/* <motion.div> */}
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-4xl mb-12 px-4 md:px-12">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-0 px-2 md:px-12">
            {categoriesWithImages.map((categoryItem) => (
              <div
                key={categoryItem.id}
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                className="cursor-pointer w-full sm:w-52 hover:shadow-lg transition-shadow relative overflow-hidden"
              >
                <div
                  className="h-40 sm:h-52 bg-cover sm:bg-contain w-full sm:w-52 bg-top rounded-t-md transform transition-transform duration-300 hover:scale-110"
                  style={{ backgroundImage: `url(${categoryItem.image})` }}
                ></div>
                <div className="flex justify-between items-center p-4 bg-white border-t border-gray-200 rounded-b-md">
                  <span className="text-gray-700 text-sm sm:text-xl">{categoryItem.label}</span>
                  <ChevronRightIcon className="w-5 h-5 text-gray-600" />
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* </motion.div> */}
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-white">
        {/* <motion.div> */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <h2 className="text-2xl sm:text-4xl mb-12  ">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {productList && productList.length > 0 ? (
              productList.map((productItem) => (
                <ShoppingProductTile
                  key={productItem._id}
                  handleGetProductDetails={handleNavigateToProductDetails}
                  product={productItem}
                  handleAddtoCart={handleAddtoCart}
                />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">
                No featured products available.
              </p>
            )}
          </div>
        </div>
        {/* </motion.div> */}
      </section>

      {/* New Arrivals */}
      <section className="py-12 bg-gray-50">
        {/* <motion.div> */}
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-4xl mb-12 px-4 md:px-12">New Arrival Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 px-4 md:px-12">
            {newArrivals && newArrivals.length > 0 ? (
              newArrivals.map((productItem) => (
                <ShoppingProductTile
                  key={productItem._id}
                  handleGetProductDetails={handleNavigateToProductDetails}
                  product={productItem}
                  handleAddtoCart={handleAddtoCart}
                />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">
                No new arrivals found
              </p>
            )}
          </div>
        </div>
        {/* </motion.div> */}
      </section>
    </div>
  );
}

export default ShoppingHome;
