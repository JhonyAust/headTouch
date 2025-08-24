import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useRef } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";

function ProductImageUpload({
  uploadedImageUrl = "",            // ✅ single image (string)
  setUploadedImageUrl = () => {},   // ✅ setter function
  imageLoadingState = false,        // ✅ loading state (boolean)
  setImageLoadingState = () => {},  // ✅ setter for loading state
  isEditMode = false,
  isCustomStyling = false,
}) {
  const inputRef = useRef(null);

  async function uploadImageToCloudinary(file) {
    const data = new FormData();
    data.append("my_file", file);

    setImageLoadingState(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/products/upload-image",
        data
      );

      if (response?.data?.success) {
        setUploadedImageUrl(response.data.result.url);
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setImageLoadingState(false);
    }
  }

  function handleImageFileChange(event) {
    const file = event.target.files?.[0];
    if (file) uploadImageToCloudinary(file);
  }

  return (
    <div className={`w-full mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}>
      <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>

      {/* Hidden input for file upload */}
      <Input
        id="image-upload"
        type="file"
        className="hidden"
        ref={inputRef}
        onChange={handleImageFileChange}
        disabled={isEditMode}
      />

      {/* Upload box */}
      <Label
        htmlFor="image-upload"
        className={`${
          isEditMode ? "cursor-not-allowed" : ""
        } flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg cursor-pointer`}
      >
        <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
        <span>Click to upload feature image</span>
      </Label>

      {/* Uploaded image info */}
      <div className="mt-4">
        {uploadedImageUrl && (
          <div className="flex items-center justify-between border p-2 rounded">
            <div className="flex items-center gap-2">
              <FileIcon className="w-5 h-5 text-primary" />
              <span className="text-sm truncate max-w-[200px]">
                {uploadedImageUrl}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setUploadedImageUrl("")}
            >
              <XIcon className="w-4 h-4" />
            </Button>
          </div>
        )}

        {imageLoadingState && (
          <Skeleton className="h-10 bg-gray-100 mt-2" />
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;
