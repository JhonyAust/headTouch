import { useSelector, useDispatch } from "react-redux";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { closePopup, switchToLogin, switchToRegister } from "../../store/loginRegister-slice";
import { useToast } from "@/components/ui/use-toast";
import CommonForm from "@/components/common/form";
import { loginFormControls, registerFormControls } from "@/config";
import { loginUser, registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addToCart } from "@/store/shop/cart-slice";
import { getLocalCartItemsHelper, clearLocalCartHelper } from "@/store/shop/cart-slice-local";
import { fetchCartItems } from "@/store/shop/cart-slice";
import {
  getLocalWishlistItemsHelper,
  clearLocalWishlistHelper,
} from "@/store/shop/wishlist-slice-local";
import { toggleWishlistItem, fetchWishlist } from "@/store/shop/wishlist-slice";
import { loginWithGoogle } from "@/store/auth-slice";
import { Sparkles, LogIn, UserPlus, X } from "lucide-react";

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
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loginData, setLoginData] = useState(initialLoginState);
  const [registerData, setRegisterData] = useState(initialRegisterState);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    dispatch(closePopup());
    navigate('/shop/home');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

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
    setIsLoading(false);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    dispatch(registerUser(registerData)).then((data) => {
      if (data?.payload?.success) {
        toast({ title: data?.payload?.message });
        dispatch(switchToLogin());
      } else {
        toast({ title: data?.payload?.message, variant: "destructive" });
      }
      setIsLoading(false);
    });
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const result = await dispatch(loginWithGoogle());

    if (result?.payload?.success) {
      toast({ title: result.payload.message });
      dispatch(closePopup());
    } else {
      toast({ title: result?.payload?.message || result?.error, variant: "destructive" });
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[440px] p-0 overflow-hidden border-0 bg-transparent">
        <div className="relative bg-white rounded-2xl shadow-2xl">
          {/* Animated Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 opacity-60 rounded-2xl"></div>
          
          {/* Decorative Blobs */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-300 rounded-full blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-pink-300 rounded-full blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-gray-900 transition-all duration-300 hover:scale-110 shadow-md"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative z-10 p-8">
            {/* Header with Animation */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full">
                <Sparkles className="w-5 h-5 text-purple-600 animate-pulse" />
                <span className="text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {mode === "login" ? "Welcome Back!" : "Join HeadTouch"}
                </span>
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight mb-3 bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent">
                {mode === "login" ? "Sign In" : "Create Account"}
              </h1>

              <p className="text-sm text-gray-600">
                {mode === "login" ? (
                  <>
                    New to HeadTouch?{" "}
                    <button
                      onClick={() => dispatch(switchToRegister())}
                      className="font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                    >
                      Create an account
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      onClick={() => dispatch(switchToLogin())}
                      className="font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </p>
            </div>

            {/* Form Container */}
            <div className="space-y-4">
              {mode === "login" ? (
                <div className="space-y-4 login-form-wrapper">
                  <CommonForm
                    formControls={loginFormControls}
                    buttonText={
                      <span className="flex items-center justify-center gap-2">
                        {isLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Signing In...
                          </>
                        ) : (
                          <>
                            <LogIn className="w-5 h-5" />
                            Sign In
                          </>
                        )}
                      </span>
                    }
                    formData={loginData}
                    setFormData={setLoginData}
                    onSubmit={handleLoginSubmit}
                  />

                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500 font-medium">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  {/* Google Login Button */}
                  <button
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="group relative w-full bg-white border-2 border-gray-200 hover:border-red-300 text-gray-700 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center justify-center gap-3">
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="#EA4335"
                          d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"
                        />
                        <path
                          fill="#34A853"
                          d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z"
                        />
                        <path
                          fill="#4A90E2"
                          d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z"
                        />
                      </svg>
                      {isLoading ? "Connecting..." : "Continue with Google"}
                    </div>
                  </button>
                </div>
              ) : (
                <div className="space-y-4 register-form-wrapper">
                  <CommonForm
                    formControls={registerFormControls}
                    buttonText={
                      <span className="flex items-center justify-center gap-2">
                        {isLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Creating Account...
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-5 h-5" />
                            Create Account
                          </>
                        )}
                      </span>
                    }
                    formData={registerData}
                    setFormData={setRegisterData}
                    onSubmit={handleRegisterSubmit}
                  />
                </div>
              )}
            </div>

            {/* Footer Note */}
            <p className="mt-6 text-center text-xs text-gray-500">
              By continuing, you agree to HeadTouch's{" "}
              <a href="/shop/terms" className="text-purple-600 hover:underline">
                Terms & Conditions
              </a>
            </p>
          </div>
        </div>

        <style jsx>{`
          @keyframes blob {
            0%, 100% {
              transform: translate(0px, 0px) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
          }

          .animate-blob {
            animation: blob 7s ease-in-out infinite;
          }

          .animation-delay-2000 {
            animation-delay: 2s;
          }

          /* Custom button styles for login */
          .login-form-wrapper button[type="submit"] {
            width: 100%;
            padding: 0.75rem 1rem;
            border-radius: 0.75rem;
            font-weight: 700;
            font-size: 1rem;
            background: linear-gradient(110deg, #9333ea 0%, #ec4899 50%, #9333ea 100%);
            background-size: 200% 100%;
            color: white;
            box-shadow: 0 10px 15px -3px rgba(147, 51, 234, 0.3);
            transition: all 0.5s ease;
            position: relative;
            overflow: hidden;
          }

          .login-form-wrapper button[type="submit"]:hover {
            background-position: 100% 0;
            transform: scale(1.02);
            box-shadow: 0 20px 25px -5px rgba(147, 51, 234, 0.4);
          }

          .login-form-wrapper button[type="submit"]:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          /* Custom button styles for register */
          .register-form-wrapper button[type="submit"] {
            width: 100%;
            padding: 0.75rem 1rem;
            border-radius: 0.75rem;
            font-weight: 700;
            font-size: 1rem;
            background: linear-gradient(110deg, #2563eb 0%, #9333ea 50%, #ec4899 100%);
            background-size: 200% 100%;
            color: white;
            box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
            transition: all 0.5s ease;
            position: relative;
            overflow: hidden;
          }

          .register-form-wrapper button[type="submit"]:hover {
            background-position: 100% 0;
            transform: scale(1.02);
            box-shadow: 0 20px 25px -5px rgba(37, 99, 235, 0.4);
          }

          .register-form-wrapper button[type="submit"]:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}

export default LoginRegisterPopup;