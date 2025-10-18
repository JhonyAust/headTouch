import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  addNewAddress, 
  editaAddress, 
  fetchAllAddresses, 
  deleteAddress 
} from "@/store/shop/address-slice";
import { useToast } from "../ui/use-toast";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { MapPin, Edit, Trash2, Phone, Home, MapPinned } from "lucide-react";

function Address() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);
  const { toast } = useToast();

  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    phone: "",
    pincode: "",
    notes: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Get the single address (first one in the list)
  const currentAddress = addressList && addressList.length > 0 ? addressList[0] : null;

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchAllAddresses(user.id));
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (currentAddress) {
      setFormData({
        name: currentAddress.name || "",
        address: currentAddress.address || "",
        city: currentAddress.city || "",
        phone: currentAddress.phone || "",
        pincode: currentAddress.pincode || "",
        notes: currentAddress.notes || "",
      });
    }
  }, [currentAddress]);

  const isFormValid = () => {
    const { name, address, city, phone, pincode } = formData;
    return (
      name.trim() !== "" &&
      address.trim() !== "" &&
      city.trim() !== "" &&
      phone.trim() !== "" &&
      pincode.trim() !== ""
    );
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      toast({ 
        title: "Please fill all required fields", 
        variant: "destructive" 
      });
      return;
    }

    setIsLoading(true);

    try {
      let result;

      if (currentAddress) {
        // Edit existing address
        result = await dispatch(editaAddress({
          userId: user?.id,
          addressId: currentAddress._id,
          formData,
        }));
      } else {
        // Add new address
        result = await dispatch(addNewAddress({
          ...formData,
          userId: user?.id,
        }));
      }

      if (result?.payload?.success) {
        toast({ 
          title: currentAddress ? "Address updated successfully" : "Address added successfully"
        });
        handleCloseDialog();
        // Refresh address
        dispatch(fetchAllAddresses(user?.id));
      } else {
        toast({ 
          title: result?.payload?.message || "Failed to save address", 
          variant: "destructive" 
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({ 
        title: "Error: " + (error.message || "Something went wrong"), 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentAddress) return;

    try {
      const result = await dispatch(deleteAddress({ 
        userId: user?.id, 
        addressId: currentAddress._id 
      }));

      if (result?.payload?.success) {
        toast({ title: "Address deleted successfully" });
        dispatch(fetchAllAddresses(user?.id));
      } else {
        toast({ 
          title: result?.payload?.message || "Failed to delete address", 
          variant: "destructive" 
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({ 
        title: "Error: " + (error.message || "Something went wrong"), 
        variant: "destructive" 
      });
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    // Reset form to current address data when closing
    if (currentAddress) {
      setFormData({
        name: currentAddress.name || "",
        address: currentAddress.address || "",
        city: currentAddress.city || "",
        phone: currentAddress.phone || "",
        pincode: currentAddress.pincode || "",
        notes: currentAddress.notes || "",
      });
    } else {
      setFormData({
        name: "",
        address: "",
        city: "",
        phone: "",
        pincode: "",
        notes: "",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Address Display or Add Button */}
      {currentAddress ? (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl border-2 border-gray-100 hover:border-blue-300 p-6 hover:shadow-xl transition-all duration-300 animate-fade-in">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                  <MapPinned className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{currentAddress.name}</h4>
                  <p className="text-xs text-gray-500">Your Delivery Address</p>
                </div>
              </div>
            </div>

            {/* Address Details */}
            <div className="space-y-3 mb-4">
              <div className="flex items-start gap-2">
                <Home className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <p className="text-sm text-gray-700">{currentAddress.address}</p>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                <p className="text-sm text-gray-700">
                  {currentAddress.city} - {currentAddress.pincode}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                <p className="text-sm font-semibold text-gray-900">
                  {currentAddress.phone}
                </p>
              </div>

              {currentAddress.notes && (
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500 italic">
                    Note: {currentAddress.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={() => setOpenDialog(true)}
                variant="outline"
                size="sm"
                className="flex-1 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Address
              </Button>
              <Button
                onClick={handleDelete}
                variant="outline"
                size="sm"
                className="flex-1 border-2 border-red-200 hover:border-red-400 hover:bg-red-50 text-red-600 hover:text-red-700 transition-all duration-300"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full blur-2xl opacity-50 animate-pulse-slow"></div>
            <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-full p-8 border-2 border-slate-200/50 shadow-lg">
              <MapPin className="w-20 h-20 text-slate-300" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">
            No Address Saved
          </h3>
          <p className="text-sm text-slate-500 mb-6 max-w-md text-center leading-relaxed">
            Add your delivery address to make checkout faster and easier!
          </p>
          <Button 
            className="group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
            onClick={() => setOpenDialog(true)}
          >
            <MapPin className="w-5 h-5 mr-2" />
            Add Your Address
          </Button>
        </div>
      )}

      {/* Edit/Add Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl border-2 border-blue-100 max-h-[80vh] overflow-y-auto">
          <DialogHeader className="mt-4 bg-white  pb-4">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-cyan-600 bg-clip-text text-transparent flex items-center gap-2">
              <MapPin className="w-6 h-6 text-blue-600" />
              {currentAddress ? "Edit Address" : "Add Your Address"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Name/Label *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Home, Office"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              />
            </div>

            {/* Address Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Address *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter your full address"
                rows="3"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition resize-none"
              />
            </div>

            {/* City Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Enter city name"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              />
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              />
            </div>

            {/* Pincode Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Postal Code *
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                placeholder="Enter postal code"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              />
            </div>

            {/* Notes Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Delivery Notes (Optional)
              </label>
              <input
                type="text"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Any special instructions"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSubmit}
                disabled={!isFormValid() || isLoading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                {isLoading ? "Saving..." : currentAddress ? "Save Changes" : "Add Address"}
              </button>
              <button
                onClick={handleCloseDialog}
                disabled={isLoading}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default Address;