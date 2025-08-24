const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const createOrder = async(req, res) => {
    try {
        const {
            userId,
            cartItems,
            addressInfo,
            orderStatus = "confirmed",
            paymentMethod = "cash_on_delivery",
            paymentStatus = "unpaid",
            totalAmount,
            orderDate = new Date(),
            orderUpdateDate = new Date(),
            cartId,
        } = req.body;

        // ✅ Update product stock
        for (let item of cartItems) {
            const product = await Product.findById(item.productId);

            if (!product || product.totalStock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Not enough stock for ${item.title}`,
                });
            }

            product.totalStock -= item.quantity;
            await product.save();
        }

        // ✅ Delete the cart after order placement
        await Cart.findByIdAndDelete(cartId);

        // ✅ Create order in DB
        const newOrder = new Order({
            userId,
            cartId,
            cartItems,
            addressInfo,
            orderStatus,
            paymentMethod,
            paymentStatus,
            totalAmount,
            orderDate,
            orderUpdateDate,
        });

        await newOrder.save();
        const io = req.app.get("io");
        io.emit("newOrderPlaced", newOrder);

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            data: newOrder,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occurred!",
        });
    }
};

const capturePayment = async(req, res) => {
    try {
        const { paymentId, payerId, orderId } = req.body;

        let order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order can not be found",
            });
        }

        order.paymentStatus = "paid";
        order.orderStatus = "confirmed";
        order.paymentId = paymentId;
        order.payerId = payerId;

        for (let item of order.cartItems) {
            let product = await Product.findById(item.productId);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Not enough stock for this product ${product.title}`,
                });
            }

            product.totalStock -= item.quantity;

            await product.save();
        }

        const getCartId = order.cartId;
        await Cart.findByIdAndDelete(getCartId);

        await order.save();

        res.status(200).json({
            success: true,
            message: "Order confirmed",
            data: order,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occured!",
        });
    }
};

const getAllOrdersByUser = async(req, res) => {
    try {
        const { userId } = req.params;

        const orders = await Order.find({ userId });

        if (!orders.length) {
            return res.status(404).json({
                success: false,
                message: "No orders found!",
            });
        }

        res.status(200).json({
            success: true,
            data: orders,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occured!",
        });
    }
};

const getOrderDetails = async(req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found!",
            });
        }

        res.status(200).json({
            success: true,
            data: order,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occured!",
        });
    }
};

module.exports = {
    createOrder,
    capturePayment,
    getAllOrdersByUser,
    getOrderDetails,
};