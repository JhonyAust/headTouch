import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { createNewOrder } from "@/store/shop/order-slice";
import { fetchAllAddresses, addNewAddress, editaAddress } from "@/store/shop/address-slice";
import { useNavigate } from "react-router-dom";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { clearLocalCart } from "@/store/shop/cart-slice-local";
import { validateCoupon, resetCoupon } from "@/store/shop/shop-coupon-slice";
import { 
  User, 
  Phone, 
  MapPin, 
  Building2, 
  Hash, 
  FileText, 
  ShoppingBag, 
  Tag, 
  Truck,
  CreditCard,
  Shield,
  CheckCircle2,
  Package,
  Sparkles
} from "lucide-react";

import { trackInitiateCheckout } from "@/components/utils/facebookPixel";

function Checkout() {
  const dispatch = useDispatch();
  const { addressList } = useSelector((state) => state.shopAddress);
  const { user } = useSelector((state) => state.auth);
  const { cartItems: shopCartItems } = useSelector((state) => state.shopCart);
  const { items: localCartItems } = useSelector((state) => state.localcart);
  const { appliedCoupon, discount, error } = useSelector((state) => state.coupon);
  const cartItems = user ? shopCartItems : { items: localCartItems };

  const { toast } = useToast();
  const navigate = useNavigate();

  const [billingDetails, setBillingDetails] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    notes: "",
  });
  const [saveBilling, setSaveBilling] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [shippingType, setShippingType] = useState("inside");
  const [couponCode, setCouponCode] = useState("");
  const shippingCharge = shippingType === "inside" ? 80 : 150;

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, item) =>
            sum +
            (item.salePrice > 0 ? item.salePrice : item.price) * item.quantity,
          0
        )
      : 0;

  const discountAmount = appliedCoupon ? (totalCartAmount * discount) / 100 : 0;
  const totalAmount = totalCartAmount + shippingCharge - discountAmount;

  useEffect(() => {
    if (user) {
      dispatch(fetchAllAddresses(user?.id)).then((data) => {
        if (data?.payload?.data && data.payload.data.length > 0) {
          const saved = data.payload.data[0];
          setBillingDetails({
            name: saved.name || "",
            phone: saved.phone || "",
            address: saved.address || "",
            city: saved.city || "",
            pincode: saved.pincode || "",
            notes: saved.notes || "",
          });
        }
      });
    }
  }, [dispatch, user]);

  useEffect(() => {
  if (cartItems && cartItems.length > 0 && totalAmount) {
    trackInitiateCheckout(cartItems, totalAmount);
  }
}, []);

  const handleInputChange = (e) => {
    setBillingDetails({ ...billingDetails, [e.target.name]: e.target.value });
  };

  const validateBDPhoneNumber = (number) => {
    const bdRegex = /^(?:\+88|88)?01[3-9]\d{8}$/;
    return bdRegex.test(number);
  };

const handlePlaceOrder = async () => {
  const { name, phone, address, city, pincode } = billingDetails;
  
  if (!name || !phone || !address || !city || !pincode) {
    toast({ title: "Please fill all required billing fields", variant: "destructive" });
    return;
  }

  if (!validateBDPhoneNumber(phone)) {
    toast({ title: "Please enter a valid BD mobile number", variant: "destructive" });
    return;
  }

  if (!cartItems || cartItems.items.length === 0) {
    toast({ title: "Your cart is empty", variant: "destructive" });
    return;
  }

  const orderData = {
    userId: user?.id,
    cartId: cartItems?._id,
    cartItems: cartItems.items.map((item) => ({
      productId: item.productId,
      title: item.title,
      image: item.image,
      price: item.salePrice > 0 ? item.salePrice : item.price,
      quantity: item.quantity,
    })),
    addressInfo: billingDetails,
    orderStatus: "pending",
    paymentMethod: "COD",
    paymentStatus: "pending",
    shippingCharge,
    shippingType,
    totalAmount,
    orderDate: new Date(),
    orderUpdateDate: new Date(),
    paymentId: "",
    payerId: "",
    couponCode: appliedCoupon?.code || null,
    discountAmount: discountAmount || 0,
  };

  setIsPlacingOrder(true);

  try {
    if (user && saveBilling) {
      const existingAddress = addressList[0];
      if (existingAddress) {
        await dispatch(
          editaAddress({
            userId: user.id,
            addressId: existingAddress._id,
            formData: billingDetails,
          })
        );
      } else {
        await dispatch(addNewAddress({ userId: user.id, ...billingDetails }));
      }
      await dispatch(fetchAllAddresses(user.id));
    }

    const orderResponse = await dispatch(createNewOrder(orderData));
    
    if (orderResponse?.payload?.success) {
      // Reset coupon
      dispatch(resetCoupon());
      setCouponCode("");

      // Clear/fetch cart
      if (user) {
        console.log("🔄 Fetching updated cart...");
        await dispatch(fetchCartItems(user.id));
      } else {
        dispatch(clearLocalCart());
      }

      toast({ 
        title: "🎉 Order Placed Successfully!",
        description: "Thank you for your purchase",
        className: "bg-green-50 border-green-200"
      });

      navigate("/shop/order-confirmation", {
        state: {
          address: billingDetails,
          cartItems: cartItems.items,
          totalAmount,
          orderDetails: orderResponse.payload.data,
        },
      });
    } else {
      const errorMessage = orderResponse?.payload?.message || "Failed to place order";
      toast({ 
        title: errorMessage,
        variant: "destructive" 
      });
    }
  } catch (error) {
    console.error("❌ Order placement error:", error);
    toast({ 
      title: "❌ Error Placing Order",
      description: "Something went wrong. Please try again.",
      variant: "destructive" 
    });
  } finally {
    setIsPlacingOrder(false);
  }
};

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      dispatch(validateCoupon(couponCode));
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(resetCoupon());
    setCouponCode("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20 mt-12 sm:mt-0">
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #dbeafe 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Header with Accent Color */}
      <div className="bg-white border-b border-blue-100 shadow-sm">
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="flex items-center justify-center gap-2 mb-2 animate-fade-in">
            <Shield className="w-5 h-5 text-blue-600" />
            <span className="text-blue-600 font-medium text-sm">Secure Checkout</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center animate-slide-up">
            Complete Your Order
          </h1>
          <p className="text-gray-600 text-center mt-1 text-sm">Just a few steps away from your purchase</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Billing Details Section */}
          <div className="space-y-6">
            {/* Billing Information Card */}
            <div className="bg-white rounded-xl shadow-md border border-blue-100/50 overflow-hidden animate-slide-in-left hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-blue-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Billing Details</h2>
              </div>

              <div className="p-6 space-y-4">
                <InputField
                  icon={User}
                  name="name"
                  placeholder="Full Name *"
                  value={billingDetails.name}
                  onChange={handleInputChange}
                />
                <InputField
                  icon={Phone}
                  name="phone"
                  placeholder="BD Mobile Number *"
                  value={billingDetails.phone}
                  onChange={handleInputChange}
                />
                <InputField
                  icon={MapPin}
                  name="address"
                  placeholder="Street Address *"
                  value={billingDetails.address}
                  onChange={handleInputChange}
                />
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    icon={Building2}
                    name="city"
                    placeholder="City *"
                    value={billingDetails.city}
                    onChange={handleInputChange}
                  />
                  <InputField
                    icon={Hash}
                    name="pincode"
                    placeholder="Post Code *"
                    value={billingDetails.pincode}
                    onChange={handleInputChange}
                  />
                </div>
                <InputField
                  icon={FileText}
                  name="notes"
                  placeholder="Order Notes (Optional)"
                  value={billingDetails.notes}
                  onChange={handleInputChange}
                  textarea
                />

                {user && (
                  <div className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-lg border border-blue-100 hover:bg-blue-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={saveBilling}
                      onChange={() => setSaveBilling(!saveBilling)}
                      className="w-4 h-4 rounded border-blue-300 text-blue-600 focus:ring-2 focus:ring-blue-400 cursor-pointer"
                      id="save-billing"
                    />
                    <label
                      htmlFor="save-billing"
                      className="text-sm font-medium text-gray-700 cursor-pointer"
                    >
                      Save billing details for future orders
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Options Card */}
            <div className="bg-white rounded-xl shadow-md border border-blue-100/50 overflow-hidden animate-slide-in-left animation-delay-100 hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-purple-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Truck className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Shipping Method</h2>
              </div>

              <div className="p-6 space-y-3">
                <ShippingOption
                  id="inside"
                  label="Inside Dhaka"
                  price="৳ 80"
                  description="Delivery in 2-3 business days"
                  checked={shippingType === "inside"}
                  onChange={() => setShippingType("inside")}
                />
                <ShippingOption
                  id="outside"
                  label="Outside Dhaka"
                  price="৳ 150"
                  description="Delivery in 3-5 business days"
                  checked={shippingType === "outside"}
                  onChange={() => setShippingType("outside")}
                />
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="bg-white rounded-xl shadow-md border border-blue-100/50 overflow-hidden animate-slide-in-left animation-delay-200 hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-green-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
              </div>

              <div className="p-6">
                <div className="bg-green-50/50 rounded-lg p-5 border border-green-100">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-white border border-green-200 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Cash on Delivery</p>
                      <p className="text-sm text-gray-600">Pay when you receive</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600 bg-white rounded-lg p-3 border border-green-100">
                    <Shield className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p>
                      Your personal information will be used to process your order and
                      enhance your experience on our website.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="sticky top-4 space-y-6">
              {/* Cart Items Card */}
              <div className="bg-white rounded-xl shadow-md border border-blue-100/50 overflow-hidden animate-slide-in-right hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-indigo-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Your Order</h2>
                </div>

                <div className="p-6">
                  {cartItems && cartItems.items && cartItems.items.length > 0 ? (
                    <div className="space-y-4 max-h-[350px] overflow-y-auto custom-scrollbar pr-2">
                      {cartItems.items.map((item, index) => (
                        <div
                          key={item.productId}
                          className="animate-fade-in"
                          style={{ animationDelay: `${index * 0.05}s` }}
                        >
                          <UserCartItemsContent cartItem={item} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 mx-auto text-gray-300 mb-3" />
                      <p className="text-gray-500">Your cart is empty</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Coupon & Summary Card */}
              <div className="bg-white rounded-xl shadow-md border border-blue-100/50 overflow-hidden animate-slide-in-right animation-delay-100 hover:shadow-lg transition-shadow">
                <div className="p-6 space-y-5">
                  {/* Coupon Section */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Tag className="w-4 h-4 text-amber-600" />
                      <label className="font-medium text-gray-900 text-sm">Have a Coupon?</label>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 w-full">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 px-2 sm:px-3 py-2 border border-amber-200 rounded-lg focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-sm w-full"
                        placeholder="Enter code"
                      />
                      {!appliedCoupon ? (
                        <Button
                          onClick={handleApplyCoupon}
                          className="bg-amber-600 hover:bg-amber-700 text-white px-2 sm:px-4 text-sm font-medium w-full sm:w-auto"
                        >
                          Apply
                        </Button>
                      ) : (
                        <Button
                          onClick={handleRemoveCoupon}
                          variant="destructive"
                          className="px-4 text-sm w-full sm:w-auto"
                        >
                          Remove
                        </Button>
                      )}
                    </div>

                    {error && (
                      <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                        <span>⚠️</span> {error}
                      </p>
                    )}
                    {appliedCoupon && (
                      <div className="mt-3 bg-white rounded-lg p-3 flex items-center gap-2 border border-green-200 animate-scale-in">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <p className="text-green-700 text-sm font-medium">
                          Coupon <b>{appliedCoupon.code}</b> applied! You saved ৳{discountAmount}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Price Summary */}
                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <PriceLine label="Subtotal" value={`৳ ${totalCartAmount}`} />
                    <PriceLine label="Shipping" value={`৳ ${shippingCharge}`} />
                    {appliedCoupon && (
                      <PriceLine
                        label="Discount"
                        value={`-৳ ${discountAmount}`}
                        className="text-green-600"
                      />
                    )}
                    <div className="pt-3 border-t-2 border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">Total</span>
                        <span className="text-2xl font-bold text-indigo-600">
                          ৳ {totalAmount}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <Button
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder || !cartItems?.items?.length}
                    className="w-full py-5 text-base font-semibold bg-gradient-to-r  from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {isPlacingOrder ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Processing Order...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Shield className="w-5 h-5" />
                        PLACE ORDER SECURELY
                      </span>
                    )}
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <Shield className="w-3 h-3" />
                    <span>Secure SSL Encrypted Payment</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
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

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.5s ease-out;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.5s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }

        .animation-delay-100 {
          animation-delay: 0.1s;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}

const InputField = ({ icon: Icon, name, placeholder, value, onChange, textarea }) => {
  const Component = textarea ? "textarea" : "input";
  return (
    <div className="relative group">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
        <Icon className="w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
      </div>
      <Component
        type="text"
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={textarea ? 3 : undefined}
        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none text-sm hover:border-blue-300"
      />
    </div>
  );
};

const ShippingOption = ({ id, label, price, description, checked, onChange }) => (
  <label
    htmlFor={id}
    className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
      checked
        ? "border-purple-500 bg-purple-50/50"
        : "border-gray-200 hover:border-purple-300 hover:bg-purple-50/30"
    }`}
  >
    <div className="flex items-center gap-3">
      <input
        type="radio"
        id={id}
        name="shipping"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-2 focus:ring-purple-400"
      />
      <div>
        <p className="font-medium text-gray-900 text-sm">{label}</p>
        <p className="text-xs text-gray-600">{description}</p>
      </div>
    </div>
    <span className="font-semibold text-purple-600">{price}</span>
  </label>
);

const PriceLine = ({ label, value, className = "" }) => (
  <div className={`flex justify-between items-center text-sm ${className}`}>
    <span className="font-medium text-gray-700">{label}</span>
    <span className="font-semibold text-gray-900">{value}</span>
  </div>
);

export default Checkout;