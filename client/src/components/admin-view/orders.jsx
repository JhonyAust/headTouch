import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogContent } from "../ui/dialog";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
} from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;
  const navigate = useNavigate();
  const { orderList, orderDetails } = useSelector((state) => state.adminOrder);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails) setOpenDetailsDialog(true);
    else setOpenDetailsDialog(false);
  }, [orderDetails]);

  const handleFetchOrderDetails = (getId) => {
    dispatch(getOrderDetailsForAdmin(getId));
  };

  // Pagination logic
  const totalPages = Math.ceil(orderList.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const endIndex = startIndex + ordersPerPage;
  const paginatedOrders = orderList.slice(startIndex, endIndex);

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
      </CardHeader>

      <CardContent className="overflow-x-auto">
        <Table className="min-w-[300px]">
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              {/* Hide columns on mobile */}
              <TableHead className="hidden md:table-cell">Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead className="hidden md:table-cell">Order Price</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedOrders.map((orderItem) => (
              <TableRow key={orderItem._id}>
                <TableCell>
                  <button
                    onClick={() => navigate(`/admin/orders/${orderItem._id}`)}
                    className="text-blue-600 hover:underline hover:text-blue-800 transition-colors duration-200 font-medium"
                  >
                    #{orderItem._id.slice(-5)}
                  </button>
                </TableCell>

                <TableCell className="hidden md:table-cell">
                  {orderItem?.orderDate.split("T")[0]}
                </TableCell>

                <TableCell>
                  <Badge
                    className={`py-1 px-3 ${
                      orderItem?.orderStatus === "delivered"
                        ? "bg-green-500"
                        : orderItem?.orderStatus === "rejected"
                        ? "bg-red-600"
                        : "bg-black"
                    }`}
                  >
                    {orderItem?.orderStatus}
                  </Badge>
                </TableCell>

                <TableCell className="hidden md:table-cell">
                  ৳ {orderItem?.totalAmount}
                </TableCell>

                <TableCell>
                  <Dialog
                    open={openDetailsDialog}
                    onOpenChange={() => {
                      setOpenDetailsDialog(false);
                      dispatch(resetOrderDetails());
                    }}
                  >
                    <Button onClick={() => handleFetchOrderDetails(orderItem?._id)}>
                      View Details
                    </Button>
                    <DialogContent className="w-full max-w-md sm:max-w-lg mx-auto">
                      <AdminOrderDetailsView orderDetails={orderDetails} />
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-4 flex-wrap">
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              variant="outline"
            >
              Previous
            </Button>
            <span className="text-sm font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              variant="outline"
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default AdminOrdersView;
