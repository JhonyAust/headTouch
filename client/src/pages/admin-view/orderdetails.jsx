import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getOrderDetailsForAdmin ,resetOrderDetails} from "@/store/admin/order-slice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

function AdminOrderDetailsPage() {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const { orderDetails } = useSelector((state) => state.adminOrder);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (orderId) {
      dispatch(getOrderDetailsForAdmin(orderId));
    }
     return () => {
    dispatch(resetOrderDetails()); // ✅ Cleanup on unmount
  };
  }, [dispatch, orderId]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card className="shadow-xl border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Order Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Order ID</p>
              <Label>{orderDetails?._id}</Label>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Order Date</p>
              <Label>{orderDetails?.orderDate?.split("T")[0]}</Label>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Price</p>
              <Label>৳ {orderDetails?.totalAmount}</Label>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Payment Method</p>
              <Label>{orderDetails?.paymentMethod}</Label>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Payment Status</p>
              <Label>{orderDetails?.paymentStatus}</Label>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Order Status</p>
              <Badge
                className={`py-1 px-3 mt-1 capitalize text-white font-medium ${
                  orderDetails?.orderStatus === "delivered"
                    ? "bg-green-500"
                    : orderDetails?.orderStatus === "rejected"
                    ? "bg-red-600"
                    : "bg-black"
                }`}
              >
                {orderDetails?.orderStatus}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Order Items */}
          <div>
            <p className="text-lg font-semibold mb-3">Cart Items</p>
            <div className="space-y-3">
              {orderDetails?.cartItems?.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-3 gap-2 p-3 border rounded-lg shadow-sm"
                >
                  <span className="font-medium">🛒 {item.title}</span>
                  <span>Qty: {item.quantity}</span>
                  <span>Price: ৳ {item.price}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Shipping Info */}
          <div>
            <p className="text-lg font-semibold mb-2">Shipping Info</p>
            <div className="grid gap-1 text-muted-foreground">
              <span>👤 {user?.userName}</span>
              <span>🏠 {orderDetails?.addressInfo?.address}</span>
              <span>📍 {orderDetails?.addressInfo?.city} - {orderDetails?.addressInfo?.pincode}</span>
              <span>📞 {orderDetails?.addressInfo?.phone}</span>
              {orderDetails?.addressInfo?.notes && (
                <span>📝 Notes: {orderDetails?.addressInfo?.notes}</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminOrderDetailsPage;
