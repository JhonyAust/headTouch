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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { MapPin, Plus, Edit, Trash2, Phone, Home, MapPinned } from "lucide-react";

function Address() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);
  const { toast } = useToast();

  const [openDialog, setOpenDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    phone: "",
    pincode: "",
    notes: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchAllAddresses(user.id));
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (editingAddress) {
      setFormData({
        name: editingAddress.name || "",
        address: editingAddress.address || "",
        city: editingAddress.city || "",
        phone: editingAddress.phone || "",
        pincode: editingAddress.pincode || "",
        notes: editingAddress.notes || "",
      });
    }
  }, [editingAddress]);

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

      if (editingAddress) {
        // Edit existing address
        result = await dispatch(editaAddress({
          userId: user?.id,
          addressId: editingAddress._id,
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
          title: editingAddress ? "Address updated successfully" : "Address added successfully"
        });
        handleCloseDialog();
        // Refresh addresses list
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

  const handleDelete = async (addressId) => {
    try {
      const result = await dispatch(deleteAddress({ 
        userId: user?.id, 
        addressId 
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
    setEditingAddress(null);
    setFormData({
      name: "",
      address: "",
      city: "",
      phone: "",
      pincode: "",
      notes: "",
    });
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setOpenDialog(true);
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
      {/* Add New Address Button */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <Button 
            className="group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
            onClick={() => {
              setEditingAddress(null);
              setFormData({
                name: "",
                address: "",
                city: "",
                phone: "",
                pincode: "",
                notes: "",
              });
            }}
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            Add New Address
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[500px] rounded-2xl border-2 border-blue-100 max-h-[85vh] overflow-y-auto">
          <DialogHeader className="sticky top-0 bg-white z-10 pb-4">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-cyan-600 bg-clip-text text-transparent flex items-center gap-2">
              <MapPin className="w-6 h-6 text-blue-600" />
              {editingAddress ? "Edit Address" : "Add New Address"}
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
                {isLoading ? "Saving..." : editingAddress ? "Save Changes" : "Add Address"}
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

      {/* Address List */}
      {addressList && addressList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addressList.map((addressItem, index) => (
            <div
              key={addressItem._id}
              className="group bg-white rounded-xl border-2 border-gray-100 hover:border-blue-300 p-6 hover:shadow-xl transition-all duration-300 animate-fade-in-up relative"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <MapPinned className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{addressItem.name}</h4>
                    <p className="text-xs text-gray-500">ID: {addressItem._id.slice(-6)}</p>
                  </div>
                </div>
              </div>

              {/* Address Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-start gap-2">
                  <Home className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-700">{addressItem.address}</p>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                  <p className="text-sm text-gray-700">
                    {addressItem.city} - {addressItem.pincode}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                  <p className="text-sm font-semibold text-gray-900">
                    {addressItem.phone}
                  </p>
                </div>

                {addressItem.notes && (
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500 italic">
                      Note: {addressItem.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={() => handleEdit(addressItem)}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(addressItem._id)}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-2 border-red-200 hover:border-red-400 hover:bg-red-50 text-red-600 hover:text-red-700 transition-all duration-300"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
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
            No Addresses Saved
          </h3>
          <p className="text-sm text-slate-500 mb-6 max-w-md text-center leading-relaxed">
            Add a new address to make checkout faster and easier!
          </p>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
          opacity: 0;
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