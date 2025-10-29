const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

require("dotenv").config();

// Import all routes
const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");
const adminUserRouter = require("./routes/admin/user-routes");
const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");
const commonFeatureRouter = require("./routes/common/feature-routes");
const wishlistRoutes = require("./routes/shop/wishlist-routes");
const couponRoutes = require("./routes/admin/coupon-routes");

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
    "http://localhost:5173",
    "https://headtouchbd.com",
    "https://www.headtouchbd.com",
    "https://www.facebook.com",
    "https://l.messenger.com",
    "https://m.facebook.com",
    "https://lm.facebook.com",
    "https://m.me",
    "https://fb.com",
];

// Create HTTP server
const server = http.createServer(app);

// Configure Socket.IO with proper settings
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
    upgradeTimeout: 30000,
    transports: ["polling", "websocket"],
    allowEIO3: true,
    path: "/socket.io/",
});

// MongoDB connection
mongoose.connect(process.env.MONGO)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));


// ⭐ TEMPORARY FIX: Force all Cloudinary URLs to HTTPS
app.use((req, res, next) => {
    const originalJson = res.json;
    
    res.json = function(data) {
        // Recursively convert all HTTP Cloudinary URLs to HTTPS
        const convertToHttps = (obj) => {
            if (!obj) return obj;
            
            if (typeof obj === 'string') {
                // Convert Cloudinary HTTP URLs to HTTPS
                if (obj.includes('res.cloudinary.com') && obj.startsWith('http://')) {
                    return obj.replace('http://', 'https://');
                }
                return obj;
            }
            
            if (Array.isArray(obj)) {
                return obj.map(item => convertToHttps(item));
            }
            
            if (typeof obj === 'object') {
                const converted = {};
                for (const key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        converted[key] = convertToHttps(obj[key]);
                    }
                }
                return converted;
            }
            
            return obj;
        };
        
        const convertedData = convertToHttps(data);
        originalJson.call(this, convertedData);
    };
    
    next();
});



    // ⭐ CRITICAL: Enhanced CORS for Messenger/Facebook
app.use(
    cors({
        origin: function(origin, callback) {
            // Allow requests with no origin (mobile apps, Messenger)
            if (!origin) {
                console.log("✅ Allowing request with no origin (likely mobile/Messenger)");
                return callback(null, true);
            }
            
            // Check if origin is in allowed list
            if (allowedOrigins.includes(origin)) {
                console.log("✅ Allowed origin:", origin);
                return callback(null, true);
            }
            
            // Allow Facebook/Messenger subdomains
            if (origin.includes('facebook.com') || 
                origin.includes('messenger.com') || 
                origin.includes('fb.com') ||
                origin.includes('m.me')) {
                console.log("✅ Allowed Facebook/Messenger origin:", origin);
                return callback(null, true);
            }
            
            console.log("⚠️ Blocked by CORS:", origin);
            // Still allow for debugging - change to callback(new Error(...)) in production
            callback(null, true);
        },
        methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "Cache-Control",
            "Expires",
            "Pragma",
            "X-Requested-With",
        ],
        credentials: true,
        exposedHeaders: ["Set-Cookie"],
        preflightContinue: false,
        optionsSuccessStatus: 204
    })
);

// ⭐ Additional CORS headers for Messenger compatibility
app.use((req, res, next) => {
    const origin = req.headers.origin;
    
    if (!origin || allowedOrigins.includes(origin) || 
        origin.includes('facebook.com') || 
        origin.includes('messenger.com') ||
        origin.includes('fb.com') ||
        origin.includes('m.me')) {
        res.header('Access-Control-Allow-Origin', origin || '*');
    }
    
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Cache-Control');
    res.header('Access-Control-Expose-Headers', 'Set-Cookie');
    
    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }
    
    next();
});

app.use(cookieParser());
app.use(express.json());

// ⭐ Serve static files (for images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Make io accessible to routes
app.set("io", io);

// ⭐ Add request logger for debugging Messenger requests
app.use((req, res, next) => {
    const userAgent = req.headers['user-agent'] || '';
    const isMessenger = userAgent.includes('FBAN') || 
                       userAgent.includes('FBAV') || 
                       userAgent.includes('Messenger');
    
    if (isMessenger) {
        console.log("📱 Messenger Request:", {
            method: req.method,
            path: req.path,
            origin: req.headers.origin,
            userAgent: userAgent.substring(0, 50)
        });
    }
    next();
});

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);
app.use("/api/admin/users", adminUserRouter);
app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);
app.use("/api/common/feature", commonFeatureRouter);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/coupons", couponRoutes);

// ⭐ Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        userAgent: req.headers['user-agent'],
        origin: req.headers.origin,
    });
});

// Health check endpoint for Socket.IO
app.get("/api/socket-status", (req, res) => {
    const sockets = Array.from(io.sockets.sockets.values());
    res.json({
        status: "ok",
        connectedClients: io.engine.clientsCount,
        socketIds: sockets.map(s => s.id),
        timestamp: new Date().toISOString(),
    });
});

// Test endpoint to manually emit event
app.post("/api/test-socket", (req, res) => {
    const testOrder = {
        _id: "TEST123",
        totalAmount: 999,
        orderStatus: "confirmed",
        cartItems: [],
        addressInfo: {},
        orderDate: new Date()
    };
    
    console.log("🧪 Test emit - Connected clients:", io.engine.clientsCount);
    io.emit("newOrderPlaced", testOrder);
    
    res.json({
        success: true,
        message: "Test event emitted",
        connectedClients: io.engine.clientsCount
    });
});

// Socket.IO connection handling
io.on("connection", (socket) => {
    console.log("\n🎉 ============================================");
    console.log("✅ NEW CLIENT CONNECTED!");
    console.log("📋 Socket ID:", socket.id);
    console.log("🌐 Client IP:", socket.handshake.address);
    console.log("🔌 Transport:", socket.conn.transport.name);
    console.log("📍 Origin:", socket.handshake.headers.origin);
    console.log("👥 Total connected clients:", io.engine.clientsCount);
    console.log("============================================\n");

    socket.emit("connected", {
        socketId: socket.id,
        message: "Successfully connected to server",
        timestamp: new Date().toISOString()
    });

    socket.conn.on("upgrade", (transport) => {
        console.log(`🔄 Transport upgraded to: ${transport.name} for socket ${socket.id}`);
    });

    socket.on("ping", () => {
        console.log("💓 Heartbeat received from:", socket.id);
        socket.emit("pong", { timestamp: new Date().toISOString() });
    });

    socket.on("testEvent", (data) => {
        console.log("🧪 Test event received:", data);
        socket.emit("testResponse", { received: true, data });
    });

    socket.on("disconnect", (reason) => {
        console.log("\n⚠️ ============================================");
        console.log("❌ CLIENT DISCONNECTED!");
        console.log("📋 Socket ID:", socket.id);
        console.log("📝 Reason:", reason);
        console.log("👥 Remaining clients:", io.engine.clientsCount);
        console.log("============================================\n");
    });

    socket.on("error", (error) => {
        console.error("🔴 Socket error for", socket.id, ":", error);
    });
});

// Log Socket.IO errors
io.engine.on("connection_error", (err) => {
    console.error("🔴 Socket.IO Engine Error:");
    console.error("   Code:", err.code);
    console.error("   Message:", err.message);
    console.error("   Context:", err.context);
});

// ⭐ Error handling middleware
app.use((err, req, res, next) => {
    console.error("❌ Server Error:", err);
    res.status(500).json({
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
server.listen(PORT, () => {
    console.log("\n🚀 ================================================");
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🔌 Socket.IO ready on port ${PORT}`);
    console.log(`📍 Allowed origins:`, allowedOrigins);
    console.log(`📁 Static files served from: /uploads`);
    console.log("================================================\n");
});

// Graceful shutdown
process.on("SIGTERM", () => {
    console.log("⚠️ SIGTERM received, closing server gracefully");
    server.close(() => {
        console.log("✅ Server closed");
        mongoose.connection.close(false, () => {
            console.log("✅ MongoDB connection closed");
            process.exit(0);
        });
    });
});