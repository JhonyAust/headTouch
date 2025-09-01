import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { createNewOrder } from "@/store/shop/order-slice";
import { fetchAllAddresses, addNewAddress,editaAddress } from "@/store/shop/address-slice";
import { useNavigate } from "react-router-dom";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import img from "../../assets/account.jpg";
import { fetchCartItems } from "@/store/shop/cart-slice"; 
import { clearLocalCart } from "@/store/shop/cart-slice-local";


function Checkout() {
  const dispatch = useDispatch();
  const { addressList } = useSelector((state) => state.shopAddress);
  const { user } = useSelector((state) => state.auth);
  const { cartItems: shopCartItems } = useSelector((state) => state.shopCart);
  const { items: localCartItems } = useSelector((state) => state.localcart);

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
  const [shippingType, setShippingType] = useState("inside"); // default is inside Dhaka
  const shippingCharge = shippingType === "inside" ? 80 : 150;

  // Load saved billing details if user is logged in
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
    };

    setIsPlacingOrder(true);

    /** 🔥 Save billing details for logged in user if checked */
    if (user && saveBilling) {
        const existingAddress = addressList[0]; // get existing saved address if any
        if (existingAddress) {
          // 🔥 If address exists, update it
          await dispatch(editaAddress({
            userId: user.id,
            addressId: existingAddress._id,
            formData: billingDetails
          }));
        } else {
          // 🔥 If no address exists, add new
          await dispatch(addNewAddress({ userId: user.id, ...billingDetails }));
        }

        await dispatch(fetchAllAddresses(user.id)); // Fetch updated addresses
      }


    dispatch(createNewOrder(orderData)).then((data) => {
      setIsPlacingOrder(false);
      if (data?.payload?.success) {
        toast({ title: "Order placed successfully" });
        if (user) {
              dispatch(fetchCartItems(user.id)); // fetch updated cart (empty after order)
            } else {
              dispatch(clearLocalCart()); // clear guest local cart
            }
        navigate("/shop/order-confirmation", {
          state: {
            address:billingDetails,
            cartItems: cartItems.items,
            totalAmount,
          },
        });
      } else {
        toast({ title: "Failed to place order", variant: "destructive" });
      }
    });
  };

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, item) =>
            sum +
            (item.salePrice > 0 ? item.salePrice : item.price) * item.quantity,
          0
        )
      : 0;

       const totalAmount =cartItems && cartItems.items && cartItems.items.reduce(
      (sum, item) =>
        sum + (item.salePrice > 0 ? item.salePrice : item.price) * item.quantity,
      0
    ) + shippingCharge;

  return (
    <div className="bg-[#F5F5F5] min-h-screen">
      {/* Banner Image */}
      {/* <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" alt="Checkout banner" />
      </div> */}

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-5 grid grid-cols-1 md:grid-cols-2 gap-5 mt-5 items-start">

        {/* Billing Details Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Billing Details</h2>

          <div className="space-y-4 md:space-y-8">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={billingDetails.name}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              name="phone"
              placeholder="BD Mobile Number"
              value={billingDetails.phone}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={billingDetails.address}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={billingDetails.city}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={billingDetails.pincode}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              name="notes"
              placeholder="Notes"
              value={billingDetails.notes}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />
          </div>

          {user && (
            <div className="mt-4 flex items-center gap-2">
              <input
                type="checkbox"
                checked={saveBilling}
                onChange={() => setSaveBilling(!saveBilling)}
              />
              <label>Save billing details for future orders</label>
            </div>
          )}
        </div>

        {/* Your Order Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4 items-center">Your Order</h2>

          {cartItems && cartItems.items && cartItems.items.length > 0 ? (
            <div className="space-y-4">
              {cartItems.items.map((item) => (
                <UserCartItemsContent key={item.productId} cartItem={item} />
              ))}

               <div className="mt-4 space-y-4">

                  {/* Shipping Option Selection */}
                  <div className="flex justify-between gap-2 border-t pt-4 mt-12">
                    <p className="font-semibold ">Shipping Options:</p>
                    <div>
                      <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="shipping"
                        value="inside"
                        checked={shippingType === "inside"}
                        onChange={() => setShippingType("inside")}
                      />
                      Inside Dhaka <span className="text-ht_primary">(৳ 80)</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="shipping"
                        value="outside"
                        checked={shippingType === "outside"}
                        onChange={() => setShippingType("outside")}
                      />
                      Outside Dhaka <span className="text-ht_primary">(৳ 150)</span>
                    </label>
                     </div>
                  </div>

                  {/* Subtotal */}
                  <div className="flex justify-between font-semibold text-md border-t pt-4">
                    <span>Subtotal</span>
                    <span className="text-ht_primary">৳ {totalCartAmount}</span>
                  </div>

                  {/* Shipping */}
                  <div className="flex justify-between font-semibold text-md">
                    <span>Shipping</span>
                    <span className="text-ht_primary">৳ {shippingCharge}</span>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between font-bold text-lg border-t pt-4">
                    <span>Total</span>
                    <span className="text-ht_primary">৳ {totalAmount}</span>
                  </div>

                </div>



              <div className="mt-8 space-y-4">
                <hr className="border-gray-300" />

                <div className="text-gray-600 text-sm space-y-2">
                  <p className="font-medium text-gray-700">Cash on Delivery</p>
                  <p>Pay conveniently with cash when your order arrives.</p>
                  <p>
                    Your personal information will be used to process your order, enhance
                    your experience on our website, and for other purposes outlined in our{" "}
                    <span className="underline">Privacy Policy</span>.
                  </p>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  className="w-full mt-4 text-white bg-ds_orange hover:bg-ds_orange_hover"
                  disabled={isPlacingOrder}
                >
                  {isPlacingOrder ? "Placing Order..." : "PLACE ORDER"}
                </Button>
              </div>

            </div>
          ) : (
            <p>Your cart is empty</p>
          )}
        </div>

      </div>
    </div>
  );
}

export default Checkout;
