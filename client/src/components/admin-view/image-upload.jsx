import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import axiosInstance from "../api/axiosInstance";
import { Skeleton } from "../ui/skeleton";

function ProductImageUpload({
  uploadedImageUrls = [],
  setUploadedImageUrls,
  isEditMode,
  isCustomStyling = false,
}) {
  const inputRef = useRef(null);
  const [imageLoadingStates, setImageLoadingStates] = useState([]);

  function handleImageFileChange(event) {
    const selectedFiles = Array.from(event.target.files || []);
    if (!selectedFiles.length) return;

    const newLoadingStates = selectedFiles.map(() => true);
    setImageLoadingStates((prev) => [...prev, ...newLoadingStates]);

    selectedFiles.forEach((file, index) => {
      uploadImageToCloudinary(file, uploadedImageUrls.length + index);
    });
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files || []);
    droppedFiles.forEach((file, index) => {
      uploadImageToCloudinary(file, uploadedImageUrls.length + index);
    });
  }

  function handleRemoveImage(index) {
    const updatedUrls = [...uploadedImageUrls];
    updatedUrls.splice(index, 1);
    setUploadedImageUrls(updatedUrls);

    const updatedLoading = [...imageLoadingStates];
    updatedLoading.splice(index, 1);
    setImageLoadingStates(updatedLoading);
  }

  async function uploadImageToCloudinary(file, index) {
    const data = new FormData();
    data.append("my_file", file);

    try {
      const response = await axiosInstance.post(
        "/api/admin/products/upload-image",
        data
      );

      if (response?.data?.success) {
        setUploadedImageUrls((prev) => [...prev, response.data.result.url]);
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setImageLoadingStates((prev) => {
        const newStates = [...prev];
        newStates[index] = false;
        return newStates;
      });
    }
  }

  return (
    <div className={`w-full mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}>
      <Label className="text-lg font-semibold mb-2 block">Upload Images</Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${
          isEditMode ? "opacity-60" : ""
        } border-2 border-dashed rounded-lg p-4`}
      >
        <Input
          id="image-upload"
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={isEditMode}
          multiple
        />

        <Label
          htmlFor="image-upload"
          className={`${
            isEditMode ? "cursor-not-allowed" : ""
          } flex flex-col items-center justify-center h-32 cursor-pointer`}
        >
          <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
          <span>Drag & drop or click to upload images</span>
        </Label>

        <div className="mt-4 space-y-2">
          {uploadedImageUrls.map((url, index) => (
            <div
              key={index}
              className="flex items-center justify-between border p-2 rounded"
            >
              <div className="flex items-center gap-2">
                <FileIcon className="w-5 h-5 text-primary" />
                <span className="text-sm truncate max-w-[200px]">{url}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveImage(index)}
              >
                <XIcon className="w-4 h-4" />
              </Button>
            </div>
          ))}

          {imageLoadingStates.some((loading) => loading) && (
            <Skeleton className="h-10 bg-gray-100 mt-2" />
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductImageUpload;
