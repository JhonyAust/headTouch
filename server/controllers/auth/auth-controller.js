// controllers/auth/auth-controller.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../../models/User");

// Configure Gmail transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Register
const registerUser = async(req, res) => {
    const { userName, email, password } = req.body;

    try {
        const checkUser = await User.findOne({ email });
        if (checkUser)
            return res.json({
                success: false,
                message: "User Already exists with the same email! Please try again",
            });

        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            userName,
            email,
            password: hashPassword,
        });

        await newUser.save();
        res.status(200).json({
            success: true,
            message: "Registration successful",
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occured",
        });
    }
};

// Login
const loginUser = async(req, res) => {
    const { email, password } = req.body;

    try {
        const checkUser = await User.findOne({ email });
        if (!checkUser)
            return res.json({
                success: false,
                message: "User doesn't exists! Please register first",
            });

        const checkPasswordMatch = await bcrypt.compare(
            password,
            checkUser.password
        );
        if (!checkPasswordMatch)
            return res.json({
                success: false,
                message: "Incorrect password! Please try again",
            });

        const token = jwt.sign({
                id: checkUser._id,
                role: checkUser.role,
                email: checkUser.email,
                userName: checkUser.userName,
            },
            "CLIENT_SECRET_KEY", { expiresIn: "60m" }
        );

        res.cookie("token", token, { httpOnly: true, secure: false }).json({
            success: true,
            message: "Logged in successfully",
            user: {
                email: checkUser.email,
                role: checkUser.role,
                id: checkUser._id,
                userName: checkUser.userName,
            },
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occured",
        });
    }
};

// Google Login
const googleLogin = async (req, res) => {
    const { email, userName } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                userName,
                email,
                password: "",
            });
            await user.save();

            console.log("✅ New user created from Google login:", user.email);
        } else {
            console.log("ℹ️ Existing user logged in with Google:", user.email);
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
                email: user.email,
                userName: user.userName,
            },
            "CLIENT_SECRET_KEY",
            { expiresIn: "60m" }
        );

        console.log("🎉 JWT token generated for:", user.email);

        res
            .cookie("token", token, { httpOnly: true, secure: false })
            .json({
                success: true,
                message: "Google login successful",
                user: {
                    email: user.email,
                    role: user.role,
                    id: user._id,
                    userName: user.userName,
                },
            });
    } catch (e) {
        console.error("❌ Google login error:", e.message || e);
        res.status(500).json({
            success: false,
            message: "Google login failed",
            error: e.message || e,
        });
    }
};

// Logout
const logoutUser = (req, res) => {
    res.clearCookie("token").json({
        success: true,
        message: "Logged out successfully!",
    });
};

// Auth Middleware
const authMiddleware = async(req, res, next) => {
    const token = req.cookies.token;
    if (!token)
        return res.status(401).json({
            success: false,
            message: "Unauthorised user!",
        });

    try {
        const decoded = jwt.verify(token, "CLIENT_SECRET_KEY");
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Unauthorised user!",
        });
    }
};

// Admin Middleware
const adminMiddleware = (req, res, next) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Forbidden: Admins only",
        });
    }
    next();
};

// 🔐 FORGOT PASSWORD - Send Reset Email (Debug Version)
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        console.log("📩 Incoming forgot password request:", email);

        // 🧩 1. Validate input
        if (!email) {
            console.log("⚠️ No email provided in request body");
            return res.status(400).json({
                success: false,
                message: 'Email is required',
            });
        }

        // 🧩 2. Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        console.log("🔍 Checking user in database:", user ? user.email : "❌ Not found");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No account found with this email address',
            });
        }

        // 🧩 3. Generate reset token
        const resetToken = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET || "CLIENT_SECRET_KEY",
            { expiresIn: '1h' }
        );

        console.log("🪪 Generated JWT reset token for user:", user.email);

        // 🧩 4. Create reset link
        const resetLink = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
        console.log("🔗 Reset password link:", resetLink);

        // 🧩 5. Create email content
        const emailHTML = `
            <html>
            <body style="font-family: Arial; padding: 20px;">
                <h2>Password Reset Request</h2>
                <p>Hi ${user.userName || "there"},</p>
                <p>Click the link below to reset your password:</p>
                <a href="${resetLink}" style="color: blue;">${resetLink}</a>
                <p>This link will expire in 1 hour.</p>
            </body>
            </html>
        `;

        // 🧩 6. Verify transporter connection (debug only)
        await transporter.verify()
            .then(() => console.log("✅ SMTP connection verified"))
            .catch(err => console.error("❌ SMTP verification failed:", err));

        // 🧩 7. Send the email
        await transporter.sendMail({
            from: `"HeadTouch" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: '🔐 Reset Your Password',
            html: emailHTML,
        });

        console.log(`📤 Password reset email successfully sent to: ${email}`);

        // 🧩 8. Respond to frontend
        res.status(200).json({
            success: true,
            message: 'Password reset link sent to your email.',
        });

    } catch (error) {
        console.error("❌ Forgot password error:", error.message || error);

        // More detailed debugging info:
        if (error.response) {
            console.error("💬 Nodemailer Response Error:", error.response);
        }

        res.status(500).json({
            success: false,
            message: 'Failed to send reset email. Please try again later.',
        });
    }
};


// 🔐 VERIFY RESET TOKEN
const verifyResetToken = async (req, res) => {
    try {
        const { token } = req.params;

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "CLIENT_SECRET_KEY");
        
        // Check if user still exists
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Token is valid',
            email: decoded.email
        });

    } catch (error) {
        console.error('❌ Verify token error:', error);
        res.status(400).json({
            success: false,
            message: 'Invalid or expired reset link'
        });
    }
};

// 🔐 RESET PASSWORD
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        // Validate password
        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "CLIENT_SECRET_KEY");
        
        // Find user
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        
        // Update password
        user.password = hashedPassword;
        await user.save();

        console.log(`✅ Password reset successful for: ${user.email}`);

        // Send confirmation email
        try {
            await transporter.sendMail({
                from: `"HeadTouch" <${process.env.EMAIL_USER}>`,
                to: user.email,
                subject: '✅ Your Password Was Changed',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #9333ea;">Password Changed Successfully</h2>
                        <p>Hi ${user.userName},</p>
                        <p>Your password has been successfully changed. You can now login with your new password.</p>
                        <p>If you didn't make this change, please contact support immediately.</p>
                        <p style="margin-top: 30px; color: #666;">Best regards,<br/>HeadTouch Team</p>
                    </div>
                `
            });
        } catch (emailError) {
            console.error('⚠️ Failed to send confirmation email:', emailError);
            // Don't fail the request if email fails
        }

        res.status(200).json({
            success: true,
            message: 'Password reset successful! You can now login.'
        });

    } catch (error) {
        console.error('❌ Reset password error:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid reset link'
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({
                success: false,
                message: 'Reset link has expired. Please request a new one.'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to reset password. Please try again.'
        });
    }
};

module.exports = { 
    registerUser, 
    loginUser, 
    logoutUser, 
    authMiddleware, 
    adminMiddleware, 
    googleLogin,
    forgotPassword,
    verifyResetToken,
    resetPassword
};