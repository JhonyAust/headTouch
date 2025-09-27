import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from "@/store/admin/coupon-slice";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function AdminCouponsView() {
  const dispatch = useDispatch();
  const { coupons, loading } = useSelector((state) => state.adminCoupon);

  const [openDialog, setOpenDialog] = useState(false);
  const [editCoupon, setEditCoupon] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    discountPercentage: "",
    expiryDate: "",
  });

  useEffect(() => {
    dispatch(fetchCoupons());
  }, [dispatch]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editCoupon) {
      dispatch(updateCoupon({ id: editCoupon._id, formData }));
    } else {
      dispatch(createCoupon(formData));
    }
    setOpenDialog(false);
    setEditCoupon(null);
    setFormData({ name: "", code: "", discountPercentage: "", expiryDate: "" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      dispatch(deleteCoupon(id));
    }
  };

  const handleEdit = (coupon) => {
    setEditCoupon(coupon);
    setFormData({
      name: coupon.name,
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
      expiryDate: coupon.expiryDate?.split("T")[0] || "",
    });
    setOpenDialog(true);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Card className="shadow-xl border">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">Manage Coupons</CardTitle>
          <Button onClick={() => setOpenDialog(true)}>+ Add Coupon</Button>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : coupons.length === 0 ? (
            <p className="text-muted-foreground">No coupons available</p>
          ) : (
            <div className="space-y-4">
              {coupons.map((coupon) => (
                <div
                  key={coupon._id}
                  className="p-4 border rounded-lg shadow-sm space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">{coupon.name}</h3>
                    <Badge className="capitalize">
                      {coupon.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  <Separator />

                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <p>
                      <span className="text-muted-foreground">Code:</span>{" "}
                      {coupon.code}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Discount:</span>{" "}
                      {coupon.discountPercentage}%
                    </p>
                    <p>
                      <span className="text-muted-foreground">Expiry:</span>{" "}
                      {coupon.expiryDate
                        ? coupon.expiryDate.split("T")[0]
                        : "No expiry"}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Created:</span>{" "}
                      {coupon.createdAt?.split("T")[0]}
                    </p>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(coupon)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(coupon._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog for Add/Edit */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editCoupon ? "Edit Coupon" : "Add Coupon"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label>Code</Label>
              <Input
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label>Discount Percentage</Label>
              <Input
                type="number"
                name="discountPercentage"
                value={formData.discountPercentage}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label>Expiry Date</Label>
              <Input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpenDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editCoupon ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminCouponsView;
