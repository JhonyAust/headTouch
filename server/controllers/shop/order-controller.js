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
            couponCode,
            discountPercentage,
            discountAmount,
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
            couponCode,
            discountPercentage,
            discountAmount,
            orderDate,
            orderUpdateDate,
        });

        await newOrder.save();
        
        console.log("\n📦 ============================================");
        console.log("✅ NEW ORDER CREATED!");
        console.log("📋 Order ID:", newOrder._id);
        console.log("💰 Total Amount:", newOrder.totalAmount);
        console.log("👤 User ID:", newOrder.userId);
        console.log("============================================");
        
        // ✅ Emit Socket.IO event
        try {
            const io = req.app.get("io");
            
            if (!io) {
                console.error("❌ Socket.IO instance not found on app!");
                return res.status(201).json({
                    success: true,
                    message: "Order placed successfully (notification failed)",
                    data: newOrder,
                });
            }

            // Check connected clients
            const connectedClients = io.engine.clientsCount;
            console.log("\n🔌 Socket.IO Status:");
            console.log("   Connected clients:", connectedClients);
            
            if (connectedClients === 0) {
                console.warn("⚠️ No clients connected to Socket.IO");
            }

            // Prepare order data for emission
            const orderData = {
                _id: newOrder._id.toString(),
                totalAmount: newOrder.totalAmount,
                orderStatus: newOrder.orderStatus,
                cartItems: newOrder.cartItems,
                addressInfo: newOrder.addressInfo,
                orderDate: newOrder.orderDate,
                userId: newOrder.userId
            };

            console.log("\n📡 Emitting 'newOrderPlaced' event...");
            console.log("   Order ID:", orderData._id);
            console.log("   Amount:", orderData.totalAmount);
            
            // Emit to all connected clients
            io.emit("newOrderPlaced", orderData);
            
            console.log("✅ Event emitted successfully!");
            console.log("============================================\n");

        } catch (socketError) {
            console.error("\n❌ ============================================");
            console.error("Socket emit error:", socketError);
            console.error("============================================\n");
        }

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            data: newOrder,
        });
    } catch (e) {
        console.error("\n❌ ============================================");
        console.error("Create order error:", e);
        console.error("============================================\n");
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