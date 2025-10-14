import ProductFilter from "@/components/shopping-view/filter";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { sortOptions } from "@/config";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { addItem } from "@/store/shop/cart-slice-local"; 

import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import { ArrowUpDownIcon, Sparkles, Package, Grid3x3, LayoutGrid } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { openLoginPopup } from "../../store/loginRegister-slice";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");

      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }

  console.log(queryParams, "queryParams");

  return queryParams.join("&");
}

function ShoppingListing() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { toast } = useToast();

  const categorySearchParam = searchParams.get("category");

  function handleSort(value) {
    setSort(value);
  }

  function handleFilter(getSectionId, getCurrentOption) {
    let cpyFilters = { ...filters };
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

    if (indexOfCurrentSection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption],
      };
    } else {
      const indexOfCurrentOption =
        cpyFilters[getSectionId].indexOf(getCurrentOption);

      if (indexOfCurrentOption === -1)
        cpyFilters[getSectionId].push(getCurrentOption);
      else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
    }

    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }
  
  function handleNavigateToProductDetails(product) {
    const categorySlug = product?.category || "unknown";
    const titleSlug = product?.title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");

    navigate(`/shop/product/${categorySlug}/${titleSlug}-${product?._id}`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    console.log(getCurrentProductId);
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
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
          quantity: 1,
        })
      );
      toast({ title: "Product added to cart (Guest)" });
      return;
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
        toast({ title: "Product added to cart" });
      }
    });
  }

  useEffect(() => {
    setSort("price-lowtohigh");
    
    // Get filters from sessionStorage
    const storedFilters = JSON.parse(sessionStorage.getItem("filters")) || {};
    
    // Get category from URL query parameter
    const categoryFromUrl = searchParams.get("category");
    
    if (categoryFromUrl) {
      // If category exists in URL, add it to filters
      const updatedFilters = {
        ...storedFilters,
        category: [categoryFromUrl]
      };
      setFilters(updatedFilters);
      sessionStorage.setItem("filters", JSON.stringify(updatedFilters));
    } else {
      // Use stored filters if no category in URL
      setFilters(storedFilters);
    }
  }, [categorySearchParam, searchParams]);

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters);
      setSearchParams(new URLSearchParams(createQueryString));
    }
  }, [filters]);

  useEffect(() => {
    if (filters !== null && sort !== null)
      dispatch(
        fetchAllFilteredProducts({ filterParams: filters, sortParams: sort })
      );
  }, [dispatch, sort, filters]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20 mt-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-30 animate-float-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 3}px`,
              height: `${Math.random() * 6 + 3}px`,
              background: i % 2 === 0 ? '#60a5fa' : '#818cf8',
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 8}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 p-4 md:p-6">
        {/* Filter Sidebar with Modern Design */}
        <div className="animate-slide-in-left">
          <ProductFilter filters={filters} handleFilter={handleFilter} />
        </div>

        {/* Main Content Area */}
        <div className="space-y-6 animate-slide-in-right">
          {/* Header Card with Gradient */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100/50 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 px-6 py-5 border-b border-blue-100/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Title Section */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse-subtle">
                    <LayoutGrid className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                      Discover Products
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-slate-600 font-medium">
                        {productList?.length || 0} items available
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sort Dropdown with Modern Style */}
                <div className="flex items-center gap-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 h-10 px-4 rounded-xl border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 shadow-sm hover:shadow-md group"
                      >
                        <ArrowUpDownIcon className="h-4 w-4 text-slate-600 group-hover:text-blue-600 transition-colors" />
                        <span className="font-medium text-sm">Sort by</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px] rounded-xl border-slate-200 shadow-lg">
                      <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                        {sortOptions.map((sortItem) => (
                          <DropdownMenuRadioItem
                            value={sortItem.id}
                            key={sortItem.id}
                            className="cursor-pointer rounded-lg"
                          >
                            {sortItem.label}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {/* Products Grid with Modern Layout */}
            <div className="p-6">
              {productList && productList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {productList.map((productItem, index) => (
                    <div
                      key={productItem._id}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <ShoppingProductTile
                        handleGetProductDetails={handleNavigateToProductDetails}
                        product={productItem}
                        handleAddtoCart={handleAddtoCart}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                /* Empty State with Modern Design */
                <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-2xl opacity-50 animate-pulse-slow"></div>
                    <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-full p-8 border-2 border-slate-200/50 shadow-lg">
                      <Package className="w-20 h-20 text-slate-300" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    No Products Found
                  </h3>
                  <p className="text-sm text-slate-500 mb-6 max-w-md text-center leading-relaxed">
                    We couldn't find any products matching your filters. Try adjusting your search criteria.
                  </p>
                  <Button
                    onClick={() => setFilters({})}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 h-10 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-semibold text-sm"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Clear Filters
                    </span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-30px) translateX(20px);
          }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes pulse-subtle {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-float-slow {
          animation: float-slow ease-in-out infinite;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.6s ease-out;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.6s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default ShoppingListing;