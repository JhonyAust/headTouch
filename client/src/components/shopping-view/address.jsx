import { useState, useEffect } from "react";
import CommonForm from "../common/form";
import { useDispatch, useSelector } from "react-redux";
import { addNewAddress, editaAddress, fetchAllAddresses } from "@/store/shop/address-slice";
import { useToast } from "../ui/use-toast";

function Address({ mode, existingAddress, closeDialog }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    address: "",
    city: "",
    phone: "",
    pincode: "",
    notes: "",
  });

  useEffect(() => {
    if (existingAddress) {
      setFormData({
        address: existingAddress.address,
        city: existingAddress.city,
        phone: existingAddress.phone,
        pincode: existingAddress.pincode,
        notes: existingAddress.notes,
      });
    }
  }, [existingAddress]);

  const isFormValid = () => Object.values(formData).every(val => val.trim() !== "");

  const handleSubmit = () => {
    if (!isFormValid()) {
      toast({ title: "All fields are required", variant: "destructive" });
      return;
    }

    if (existingAddress) {
      // Edit
      dispatch(editaAddress({
        userId: user?.id,
        addressId: existingAddress._id,
        formData,
      })).then((data) => {
        if (data?.payload?.success) {
          toast({ title: "Address updated successfully" });
          closeDialog();
        }
      });
    } else {
      // Add
      dispatch(addNewAddress({
        ...formData,
        userId: user?.id,
      })).then((data) => {
        if (data?.payload?.success) {
          toast({ title: "Address added successfully" });
          closeDialog();
        }
      });
    }
  };

  return (
    <div>
      <CommonForm
        formControls={[
          { name: "address", label: "Address", type: "text" },
          { name: "city", label: "City", type: "text" },
          { name: "phone", label: "Phone", type: "text" },
          { name: "pincode", label: "Pincode", type: "text" },
          { name: "notes", label: "Notes", type: "text" },
        ]}
        formData={formData}
        setFormData={setFormData}
        buttonText={existingAddress ? "Save Changes" : "Add Address"}
        onSubmit={handleSubmit}
        isBtnDisabled={!isFormValid()}
      />
    </div>
  );
}

export default Address;
