import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useToast } from "@/components/ui/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchProductDetails } from "@/store/shop/products-slice";
import {
  getSearchResults,
  resetSearchResults,
} from "@/store/shop/search-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { SearchX, Sparkles, ArrowRight } from "lucide-react";

function SearchProducts() {
  const [keyword, setKeyword] = useState("");
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { searchResults } = useSelector((state) => state.shopSearch);
  const { productDetails } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { toast } = useToast();

  useEffect(() => {
    const keywordFromUrl = searchParams.get("keyword") || "";
    setKeyword(keywordFromUrl);

    if (keywordFromUrl.trim() && keywordFromUrl.trim().length > 3) {
      dispatch(getSearchResults(keywordFromUrl));
    } else {
      dispatch(resetSearchResults());
    }
  }, [searchParams, dispatch]);

  function handleNavigateToProductDetails(product) {
    const categorySlug = product?.category || "unknown";
    const titleSlug = product?.title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");

    navigate(`/shop/product/${categorySlug}/${titleSlug}-${product?._id}`);
  }

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    const getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });
          return;
        }
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product added to cart",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto md:px-6 px-4 py-8 mt-24 sm:mt-12">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h2 className="text-sm font-semibold text-purple-600 uppercase tracking-wide">
              Search Results
            </h2>
          </div>
          {keyword && (
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              Results for{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                "{keyword}"
              </span>
            </h1>
          )}
          {searchResults.length > 0 && (
            <p className="text-slate-600 mt-2">
              Found {searchResults.length} product{searchResults.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {!searchResults.length ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center max-w-2xl px-4">
              {/* Animated Icon Container */}
              <div className="relative inline-block mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8 rounded-3xl shadow-2xl">
                  <SearchX className="w-20 h-20 text-purple-300" strokeWidth={1.5} />
                </div>
              </div>

              {/* Main Message */}
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                No products found
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                We couldn't find anything matching{" "}
                {keyword && (
                  <span className="font-semibold text-slate-900">"{keyword}"</span>
                )}
                {!keyword && <span>your search</span>}. Try different keywords or explore our collections.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => navigate("/shop/listing")}
                  className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
                >
                  Browse All Products
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate("/shop/home")}
                  className="px-8 py-4 bg-white text-slate-700 font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-slate-200 hover:border-purple-300"
                >
                  Go to Homepage
                </button>
              </div>

              
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {searchResults.map((item, index) => (
              <div
                key={item._id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <ShoppingProductTile
                  handleAddtoCart={handleAddtoCart}
                  product={item}
                  handleGetProductDetails={handleNavigateToProductDetails}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}

export default SearchProducts;