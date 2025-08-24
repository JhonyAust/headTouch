import { useLocation, useNavigate } from "react-router-dom";
import { GiConfirmed } from "react-icons/gi";
import { useEffect } from "react";

function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();

  const { address, cartItems, totalAmount } = location.state || {};

    useEffect(() => {
    if (!address || !cartItems || !totalAmount) {
      navigate("/shop/home", { replace: true });
    }
  }, [address, cartItems, totalAmount, navigate]);

  // Don't render if data is missing
  if (!address || !cartItems || !totalAmount) return null;

  return (
    <div className="container mx-auto p-16 mt-12">
      <div className='flex justify-center items-center '>
        <div className='flex flex-col justify-center items-center'>
          <GiConfirmed className='text-green-400' size={36} />
          <h1 className="text-lg font-semibold p-6 text-center">
            Thank You!<br />Your order has been received.
          </h1>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-bold mb-4">Shipping Details</h2>
        <>
          <p><strong>Address:</strong> {address.address}</p>
          <p><strong>City:</strong> {address.city}</p>
          <p><strong>Pincode:</strong> {address.pincode}</p>
          <p><strong>Phone:</strong> {address.phone}</p>
          <p><strong>Notes:</strong> {address.notes}</p>
        </>
      </div>

      {cartItems && cartItems.length > 0 && (
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Cart Summary</h2>
          <ul className="divide-y divide-gray-200">
            {cartItems.map((item, index) => (
              <li key={index} className="py-2">
                <div className="flex justify-between">
                  <span>{item.title}</span>
                  <span className="font-semibold">
                    {item.salePrice > 0 ? item.salePrice : item.price} BDT × {item.quantity}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex justify-end mt-4">
            <span className="font-semibold text-lg">Total: {totalAmount} BDT</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderConfirmation;
