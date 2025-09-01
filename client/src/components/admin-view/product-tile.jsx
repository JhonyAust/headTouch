import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  setUploadedImageUrls,
  handleDelete,
}) {
  return (
    <Card className="w-full sm:max-w-sm mx-auto flex flex-col h-full shadow-md hover:shadow-lg transition-shadow rounded-2xl">
      {/* ✅ Product Image */}
      <div className="relative">
        <img
          src={product?.images?.[0] ? product.images[0] : "/placeholder.png"}
          alt={product?.title}
          className="w-full h-[180px] sm:h-[200px] object-cover rounded-t-2xl"
        />
      </div>

      {/* ✅ Product Info */}
      <CardContent className="flex flex-col flex-grow justify-between p-4">
        <h2 className="text-base sm:text-lg font-semibold text-gray-700 mb-2 line-clamp-1">
          {product?.title}
        </h2>

        <div className="flex justify-between items-center mb-2">
          <span
            className={`${
              product?.salePrice > 0 ? "line-through" : ""
            } text-sm sm:text-base font-medium text-gray-500`}
          >
            ৳ {product?.price}
          </span>

          {product?.salePrice > 0 && (
            <span className="text-sm sm:text-base font-semibold text-emerald-600">
              ৳ {product?.salePrice}
            </span>
          )}
        </div>
      </CardContent>

      {/* ✅ Actions */}
      <CardFooter className="flex justify-between items-center px-4 pb-4 mt-auto">
        <Button
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg transition-colors"
          onClick={() => {
            setOpenCreateProductsDialog(true);
            setCurrentEditedId(product?._id);
            setFormData(product);
            setUploadedImageUrls(product?.images || []);
          }}
        >
          Edit
        </Button>

        <Button
          className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg transition-colors"
          onClick={() => handleDelete(product?._id)}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AdminProductTile;
