import { useNavigate } from "react-router-dom";
import { ShoppingCart, X } from "lucide-react";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";
import { MdRemoveShoppingCart } from "react-icons/md";
import { useSelector } from "react-redux";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();

  // ✅ Get localCart items from Redux store
  const localCartItems = useSelector((state) => state.localcart.items);

  const items = cartItems && cartItems.length > 0 ? cartItems : localCartItems;

  const totalCartAmount =
    items && items.length > 0
      ? items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  return (
    <SheetContent className="sm:max-w-md flex flex-col h-full">
      <SheetHeader>
        <SheetTitle>Your Cart</SheetTitle>
      </SheetHeader>

      {items && items.length > 0 ? (
        <>
          <div className="mt-8 space-y-4 flex-1 overflow-y-auto p-0">
            {items.map((item) => (
              <UserCartItemsContent
                key={item.productId}
                cartItem={item}
              />
            ))}
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Subtotal :</span>
              <span className="font-bold text-ds_orange hover:text-ds_orange_hover">৳ {totalCartAmount}</span>
            </div>
          </div>

          <Button
            onClick={() => {
              navigate("/shop/checkout");
              setOpenCartSheet(false);
            }}
            className="w-full mt-6 bg-ds_orange hover:bg-ds_orange_hover"
          >
            CHECKOUT
          </Button>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 text-center">
          <MdRemoveShoppingCart className="w-28 h-28 text-gray-300 mb-4" />
          <p className="text-lg font-medium mb-6 mt-4">
            No products in the cart.
          </p>
          <Button
            onClick={() => {
              navigate("/shop/listing");
              setOpenCartSheet(false);
            }}
            className="bg-ds_orange text-white hover:bg-ds_orange_hover"
          >
            Return To Shop
          </Button>
        </div>
      )}
    </SheetContent>
  );
}

export default UserCartWrapper;
