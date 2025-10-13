import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage,
} from "@/store/common-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function AdminFeatures() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);
const [uploadedImageUrls, setUploadedImageUrls] = useState([]);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  function handleUploadFeatureImage() {
  if (!uploadedImageUrls || uploadedImageUrls.length === 0) return;

  // upload all URLs
  uploadedImageUrls.forEach((url) => {
    dispatch(addFeatureImage(url)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
      }
    });
  });

  // reset
  setUploadedImageUrls([]);
}


  function handleDeleteFeatureImage(id) {
    const confirmDelete = window.confirm("Are you sure you want to delete this image?");
    if (!confirmDelete) return;

    dispatch(deleteFeatureImage(id)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
      }
    });
  }

  return (
    <div>
     <ProductImageUpload
  uploadedImageUrls={uploadedImageUrls}
  setUploadedImageUrls={setUploadedImageUrls}
/>


      <Button onClick={handleUploadFeatureImage} className="mt-5 w-full">
        Upload
      </Button>

      <div className="flex flex-col gap-4 mt-5">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((featureImgItem) => (
              <div key={featureImgItem._id} className="relative">
                <img
                  src={featureImgItem.image}
                  className="w-full h-[300px] object-cover rounded-lg"
                  alt="Feature"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDeleteFeatureImage(featureImgItem._id)}
                  className="absolute top-2 right-2 z-10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          : <p className="text-sm text-muted-foreground text-center">No images found.</p>}
      </div>
    </div>
  );
}

export default AdminFeatures;
