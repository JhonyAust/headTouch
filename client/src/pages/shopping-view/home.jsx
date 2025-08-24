import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { SiNike, SiAdidas, SiPuma, SiZara } from "react-icons/si";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import { getFeatureImages } from "@/store/common-slice";
import premiumImage from "../../assets/cat.png";
import sportImage from "../../assets/cat4.png";
import classicImage from "../../assets/cat1.png";
import limitedImage from "../../assets/cat3.png";
import { addItem } from "@/store/shop/cart-slice-local"; // ✅ imported your localcart action

const categoriesWithImages = [
  { id: "premium", label: "Premium", image: premiumImage },
  { id: "sport", label: "Sport Edition", image: sportImage },
  { id: "vintage", label: "Vintage", image: classicImage },
  { id: "limited", label: "Limited Edition", image: limitedImage },
];

const brandsWithIcon = [
  { id: "nike", label: "Nike", icon: SiNike },
  { id: "adidas", label: "Adidas", icon: SiAdidas },
  { id: "puma", label: "Puma", icon: SiPuma },
  { id: "levi", label: "Levi's", icon: SiNike },
  { id: "zara", label: "Zara", icon: SiZara },
  { id: "h&m", label: "H&M", icon: SiPuma },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleAddtoCart(getCurrentProductId,quantity, size) {
    const product = productList.find((p) => p._id === getCurrentProductId);

    if (!user) {
      // ✅ Guest user: add to localcart redux
      dispatch(
        addItem({
          productId: product._id,
          title: product.title,
          price: product.price,
          salePrice: product.salePrice,
          image: product.images[0],
          quantity,
          size,
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
        size,
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
      setCurrentSlide(
        (prevSlide) => (prevSlide + 1) % featureImageList.length
      );
    }, 15000);

    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen ">
      {/* Banner */}
      <div className="relative w-full h-[300px] overflow-hidden ">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((slide, index) => (
              <img
                src={slide?.image}
                key={index}
                className={`${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
              />
            ))
          : null}
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) =>
                (prevSlide - 1 + featureImageList.length) %
                featureImageList.length
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
            setCurrentSlide(
              (prevSlide) => (prevSlide + 1) % featureImageList.length
            )
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 text-center">
          <button className="px-6 py-3 text-white hover:text-lg border border-white transition-all hover:border-[2px] hover:shadow-[0_0_10px_rgba(255,255,255,0.6)] hover:px-8">
            Shop Now
          </button>
          <p className="mt-4 text-white text-2xl font-bold tracking-wide">
            Stock Clearance Sale
          </p>
        </div>
      </div>

      {/* Categories */}
      <section className="py-12 bg-gray-50">
        <motion.div
          className="container mx-auto px-4"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl mb-12 px-12">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-0  px-2 md:px-12">
            {categoriesWithImages.map((categoryItem, index) => (
              <motion.div
                key={categoryItem.id}
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                className="cursor-pointer w-full sm:w-52 hover:shadow-lg transition-shadow relative overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div
                  className=" h-40 sm:h-52 bg-cover sm:bg-contain  w-full sm:w-52 bg-top rounded-t-md transform transition-transform duration-300 hover:scale-110"
                  style={{
                    backgroundImage: `url(${categoryItem.image})`,
                  }}
                ></div>
                <div className="flex justify-between items-center p-4 bg-white border-t border-gray-200 rounded-b-md">
                  <span className="text-gray-700 text-sm sm:text-xl">
                    {categoryItem.label}
                  </span>
                  <ChevronRightIcon className="w-5 h-5 text-gray-600" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <motion.div
          className="container mx-auto px-4"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl mb-12 px-12">Featured Products</h2>
          <div className="grid grid-cols-1  md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 px-4 md:px-12">
            {productList && productList.length > 0
              ? productList.map((productItem) => (
                  <ShoppingProductTile
                    key={productItem._id}
                    handleGetProductDetails={handleNavigateToProductDetails}
                    product={productItem}
                    handleAddtoCart={handleAddtoCart}
                  />
                ))
              : null}
          </div>
        </motion.div>
      </section>

      {/* Shop by Brand */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop by Brand
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brandsWithIcon.map((brandItem) => (
              <Card
                key={brandItem.id}
                onClick={() =>
                  handleNavigateToListingPage(brandItem, "brand")
                }
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <brandItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{brandItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ShoppingHome;
