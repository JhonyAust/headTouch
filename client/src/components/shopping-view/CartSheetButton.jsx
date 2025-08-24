import { useState } from "react";
import { ShoppingCartIcon } from "lucide-react";
import { Sheet, SheetContent } from "../ui/sheet";
import { Button } from "../ui/button";
import UserCartWrapper from "./cart-wrapper";
import { useSelector } from "react-redux";

function CartSheetButton() {
  const [open, setOpen] = useState(false);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const localCartItems = useSelector((state) => state.localcart.items);
  const items = user ? cartItems?.items || [] : localCartItems;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button
        onClick={() => setOpen(true)}
        variant="none"
        size="icon"
        className="relative"
      >
        <ShoppingCartIcon className="w-6 h-6 text-black" />
        <span className="absolute top-[-5px] right-[2px] font-bold text-sm text-black">
          {items.length}
        </span>
        <span className="sr-only">User cart</span>
      </Button>

      <SheetContent side="right">
        <UserCartWrapper setOpenCartSheet={setOpen} cartItems={items} />
      </SheetContent>
    </Sheet>
  );
}

export default CartSheetButton;
