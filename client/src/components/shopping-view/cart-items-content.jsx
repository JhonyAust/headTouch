import { Minus, Plus, X } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import {
  updateQuantity,
  deleteItem,
} from "@/store/shop/cart-slice-local";

function UserCartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();
  console.log("Cart Items are: ",cartItem);

  function handleUpdateQuantity(getCartItem, typeOfAction) {
    if (user) {
      if (typeOfAction === "plus") {
        const getCartItems = cartItems.items || [];
        const index = getCartItems.findIndex(
          (item) => item.productId === getCartItem?.productId
        );
        const productIndex = productList.findIndex(
          (product) => product._id === getCartItem?.productId
        );
        const totalStock = productList[productIndex]?.totalStock || 0;

        if (index > -1 && getCartItems[index].quantity + 1 > totalStock) {
          toast({
            title: `Only ${getCartItems[index].quantity} quantity can be added for this item`,
            variant: "destructive",
          });
          return;
        }
      }

      dispatch(
        updateCartQuantity({
          userId: user?.id,
          productId: getCartItem?.productId,
          quantity:
            typeOfAction === "plus"
              ? getCartItem?.quantity + 1
              : getCartItem?.quantity - 1,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          toast({ title: "Cart item is updated successfully" });
        }
      });
    } else {
      dispatch(
        updateQuantity({
          productId: getCartItem.productId,
          quantity:
            typeOfAction === "plus"
              ? getCartItem.quantity + 1
              : getCartItem.quantity - 1,
        })
      );
      toast({ title: "Cart item is updated successfully" });
    }
  }

  function handleCartItemDelete(getCartItem) {
    if (user) {
      dispatch(deleteCartItem({ userId: user?.id, productId: getCartItem?.productId }))
        .then((data) => {
          if (data?.payload?.success) {
            toast({ title: "Cart item is deleted successfully" });
          }
        });
    } else {
      dispatch(deleteItem(getCartItem.productId));
      toast({ title: "Cart item is deleted successfully" });
    }
  }

  return (
    <div className="flex items-start gap-4 p-2 border rounded-md">
      <img
        src={cartItem?.image}
        alt={cartItem?.title}
        className="w-18 h-20 object-cover rounded"
      />
      <div className="flex-1 flex flex-col">
        {/* Title and X icon */}
        <div className="flex justify-between items-start">
          <h2
            className="font-normal text-sm sm:text-md max-w-[110px] sm:max-w-[250px] truncate"
            title={cartItem?.title}
          >
            {cartItem?.title}
          </h2>
          <X
            onClick={() => handleCartItemDelete(cartItem)}
            className="cursor-pointer text-gray-500 hover:text-black"
            size={18}
          />
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6 rounded-full"
            disabled={cartItem?.quantity === 1}
            onClick={() => handleUpdateQuantity(cartItem, "minus")}
          >
            <Minus className="w-3 h-3" />
          </Button>
          <span className="text-sm">{cartItem?.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6 rounded-full"
            onClick={() => handleUpdateQuantity(cartItem, "plus")}
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>

        {/* Total Price */}
        <p className="mt-2 font-semibold text-sm text-muted-foreground text-ds_orange hover:text-ds_orange_hover">
          ৳{" "}
          {(
            (cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) *
            cartItem?.quantity
          ).toFixed(2)}
        </p>
      </div>
    </div>
  );
}

export default UserCartItemsContent;