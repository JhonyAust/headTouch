import { useSelector, useDispatch } from "react-redux";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { closePopup, switchToLogin, switchToRegister } from "../../store/loginRegister-slice";
import { useToast } from "@/components/ui/use-toast";
import CommonForm from "@/components/common/form";
import { loginFormControls, registerFormControls } from "@/config";
import { loginUser, registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { addToCart } from "@/store/shop/cart-slice";
import { getLocalCartItemsHelper, clearLocalCartHelper } from "@/store/shop/cart-slice-local";
import { fetchCartItems } from "@/store/shop/cart-slice";
import {
  getLocalWishlistItemsHelper,
  clearLocalWishlistHelper,
} from "@/store/shop/wishlist-slice-local";
import { toggleWishlistItem, fetchWishlist } from "@/store/shop/wishlist-slice";
const initialLoginState = {
  email: "",
  password: "",
};

const initialRegisterState = {
  userName: "",
  email: "",
  password: "",
};

function LoginRegisterPopup() {
  const { isOpen, mode } = useSelector((state) => state.loginRegister);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const [loginData, setLoginData] = useState(initialLoginState);
  const [registerData, setRegisterData] = useState(initialRegisterState);

const handleLoginSubmit = async (e) => {
  e.preventDefault();

  const data = await dispatch(loginUser(loginData));

  if (data?.payload?.success) {
    toast({ title: data?.payload?.message });

    const userId = data.payload.user.id;

    /** 🛒 Sync local CART to DB **/
    const guestCartItems = getLocalCartItemsHelper();

    if (guestCartItems.length > 0) {
      await Promise.all(
        guestCartItems.map((item) =>
          dispatch(
            addToCart({
              userId,
              productId: item.productId,
              quantity: item.quantity,
            })
          )
        )
      );
      clearLocalCartHelper();
      dispatch(fetchCartItems(userId));
    }

        
        /** ❤️ Sync local WISHLIST to DB **/
      const guestWishlist = getLocalWishlistItemsHelper();

      // First, fetch the latest DB wishlist
      const result = await dispatch(fetchWishlist(userId));
      const dbWishlistItems = result?.payload?.products || [];

      // Extract just the productIds from DB wishlist
      const dbProductIds = dbWishlistItems.map((item) => item._id);

      // Filter out items already in DB
      const wishlistToAdd = guestWishlist.filter(
        (productId) => !dbProductIds.includes(productId)
      );

      // Add only new items to DB
      if (wishlistToAdd.length > 0) {
        await Promise.all(
          wishlistToAdd.map((productId) =>
            dispatch(toggleWishlistItem({ userId, productId }))
          )
        );
      }

      // Clear local wishlist & update DB
      clearLocalWishlistHelper();
      dispatch(fetchWishlist(userId));


    dispatch(closePopup());
  } else {
    toast({ title: data?.payload?.message, variant: "destructive" });
  }
};



  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(registerData)).then((data) => {
      if (data?.payload?.success) {
        toast({ title: data?.payload?.message });
        dispatch(switchToLogin());
      } else {
        toast({ title: data?.payload?.message, variant: "destructive" });
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => dispatch(closePopup())}>
      <DialogContent className="max-w-[400px]">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {mode === "login" ? "Sign in to your account" : "Create a new account"}
          </h1>
          <p className="mt-2 text-sm">
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <button
                  onClick={() => dispatch(switchToRegister())}
                  className="text-primary font-medium hover:underline"
                >
                  Register
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => dispatch(switchToLogin())}
                  className="text-primary font-medium hover:underline"
                >
                  Login
                </button>
              </>
            )}
          </p>
        </div>

        {mode === "login" ? (
          <CommonForm
            formControls={loginFormControls}
            buttonText={"Sign In"}
            formData={loginData}
            setFormData={setLoginData}
            onSubmit={handleLoginSubmit}
          />
        ) : (
          <CommonForm
            formControls={registerFormControls}
            buttonText={"Sign Up"}
            formData={registerData}
            setFormData={setRegisterData}
            onSubmit={handleRegisterSubmit}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

export default LoginRegisterPopup;
