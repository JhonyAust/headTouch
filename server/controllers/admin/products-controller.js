const { imageUploadUtil } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");

const handleImageUpload = async(req, res) => {
    try {
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const url = "data:" + req.file.mimetype + ";base64," + b64;
        const result = await imageUploadUtil(url);

        res.json({
            success: true,
            result: {
                url: result.secure_url || result.url.replace('http://', 'https://'),       // Use secure_url instead of url
                public_id: result.public_id,   // Keep public_id for deletion
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error occurred during image upload",
        });
    }
};

// Add new product (with multiple images and sizes)
const addProduct = async(req, res) => {
    try {
        const {
            images, // array of URLs
            title,
            description,
            category,
            brand,
            price,
            salePrice,
            totalStock,
            averageReview,
            sizes, // array of { label, value, stock }
        } = req.body;

        const product = new Product({
            images,
            title,
            description,
            category,
            brand,
            price,
            salePrice,
            totalStock,
            averageReview,
            sizes,
        });

        await product.save();

        res.status(201).json({
            success: true,
            data: product,
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: "Error occurred while creating product",
        });
    }
};

// Fetch all products
const fetchAllProducts = async(req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json({
            success: true,
            data: products,
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: "Failed to fetch products",
        });
    }
};

// Edit product
const editProduct = async(req, res) => {
    try {
        const { id } = req.params;
        const {
            images,
            title,
            description,
            category,
            brand,
            price,
            salePrice,
            totalStock,
            averageReview,
            sizes,
        } = req.body;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        product.images = images || product.images;
        product.title = title || product.title;
        product.description = description || product.description;
        product.category = category || product.category;
        product.brand = brand || product.brand;
        product.price = price === "" ? 0 : price || product.price;
        product.salePrice = salePrice === "" ? 0 : salePrice || product.salePrice;
        product.totalStock = totalStock || product.totalStock;
        product.averageReview = averageReview || product.averageReview;
        product.sizes = sizes || product.sizes;

        await product.save();

        res.status(200).json({
            success: true,
            data: product,
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: "Error occurred while editing product",
        });
    }
};

// Delete product
const deleteProduct = async(req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: "Error occurred while deleting product",
        });
    }
};

module.exports = {
    handleImageUpload,
    addProduct,
    fetchAllProducts,
    editProduct,
    deleteProduct,
};