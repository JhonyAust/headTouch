import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { fetchWishlist } from "@/store/shop/wishlist-slice";
import { fetchCartItems, addToCart } from "@/store/shop/cart-slice";
import { addItem } from "@/store/shop/cart-slice-local";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useToast } from "@/components/ui/use-toast";

function Wishlist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  

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
  }, [dispatch, user]);

  return (
    <div className="container mx-auto px-4 mt-8 mb-12 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center">My Wishlist</h1>

      {wishlistProducts && wishlistProducts.length === 0 ? (
        <p className="text-center text-gray-500">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlistProducts && wishlistProducts.map((product) => (
            <ShoppingProductTile
              key={product._id}
              product={product}
              handleAddtoCart={handleAddtoCart}
              handleGetProductDetails={handleNavigateToProductDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
