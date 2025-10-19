// controllers/auth/auth-controller.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../../models/User");

// Configure Gmail transporter - Optimized for Render
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    pool: true,
    maxConnections: 1,
    connectionTimeout: 60000,  // 60 seconds
    greetingTimeout: 30000,    // 30 seconds
    socketTimeout: 60000       // 60 seconds
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

// 🔐 FORGOT PASSWORD - Send Reset Email (Render Compatible)
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        console.log("📩 Incoming forgot password request:", email);

        // Validate input
        if (!email) {
            console.log("⚠️ No email provided");
            return res.status(400).json({
                success: false,
                message: 'Email is required',
            });
        }

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        console.log("🔍 Checking user in database:", user ? user.email : "❌ Not found");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No account found with this email address',
            });
        }

        // Generate reset token
        const resetToken = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET || "CLIENT_SECRET_KEY",
            { expiresIn: '1h' }
        );

        console.log("🪪 Generated JWT reset token for user:", user.email);

        // Create reset link
        const resetLink = `${process.env.CLIENT_URL || 'https://headtouchbd.com'}/reset-password/${resetToken}`;
        console.log("🔗 Reset password link:", resetLink);

        // Create email HTML
        const emailHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
                    <tr>
                        <td align="center">
                            <table width="600" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                                <!-- Header -->
                                <tr>
                                    <td style="background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); padding: 40px; text-align: center;">
                                        <h1 style="color: white; margin: 0; font-size: 28px;">🔐 Password Reset</h1>
                                    </td>
                                </tr>
                                <!-- Content -->
                                <tr>
                                    <td style="padding: 40px 30px;">
                                        <p style="font-size: 16px; color: #333; margin: 0 0 15px 0;">Hi <strong>${user.userName || "there"}</strong>,</p>
                                        <p style="color: #666; margin: 0 0 25px 0; line-height: 1.6;">We received a request to reset your password for your <strong>HeadTouch</strong> account.</p>
                                        <p style="color: #666; margin: 0 0 30px 0;">Click the button below to create a new password:</p>
                                        
                                        <!-- Button -->
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td align="center" style="padding: 20px 0;">
                                                    <a href="${resetLink}" style="background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">Reset My Password</a>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <!-- Warning Box -->
                                        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 25px 0; border-radius: 4px;">
                                            <p style="margin: 0; color: #92400e; font-size: 14px;"><strong>⚠️ Security Notice:</strong> This link expires in 1 hour. If you didn't request this reset, please ignore this email.</p>
                                        </div>
                                        
                                        <!-- Link -->
                                        <p style="color: #999; font-size: 12px; margin: 20px 0 5px 0;">Or copy and paste this link into your browser:</p>
                                        <p style="word-break: break-all; color: #9333ea; font-size: 12px; background: #f5f5f5; padding: 10px; border-radius: 5px; margin: 0;">${resetLink}</p>
                                    </td>
                                </tr>
                                <!-- Footer -->
                                <tr>
                                    <td style="background: #f9fafb; padding: 20px; text-align: center;">
                                        <p style="margin: 0; color: #666; font-size: 12px;">© 2025 HeadTouch. All rights reserved.</p>
                                        <p style="margin: 10px 0 0 0; color: #999; font-size: 11px;">This is an automated email. Please do not reply.</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `;

        // ❌ DO NOT USE transporter.verify() - It causes timeout on Render
        // ✅ Send email directly without verification

        console.log("📤 Sending email directly (no verification)...");
        
        // Send email with timeout handling
        const info = await Promise.race([
            transporter.sendMail({
                from: `"HeadTouch" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: '🔐 Reset Your HeadTouch Password',
                html: emailHTML,
            }),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Email sending timeout')), 45000) // 45 second timeout
            )
        ]);

        console.log(`✅ Password reset email sent successfully! MessageID: ${info.messageId}`);

        res.status(200).json({
            success: true,
            message: 'Password reset link sent to your email.',
        });

    } catch (error) {
        console.error("❌ Forgot password error:", error.message);
        console.error("Error code:", error.code);
        console.error("Error details:", error);

        // Better error handling
        let errorMessage = 'Failed to send reset email. ';
        
        if (error.message === 'Email sending timeout') {
            errorMessage = 'Email service is taking too long. Please try again.';
        } else if (error.code === 'EAUTH') {
            errorMessage = 'Email authentication failed. Please contact support.';
            console.error("🔑 Check EMAIL_USER and EMAIL_PASS in environment variables");
        } else if (error.code === 'ETIMEDOUT') {
            errorMessage = 'Email service timeout. Please try again in a few moments.';
            console.error("⏱️ Gmail SMTP timeout - Consider switching to Brevo");
        } else if (error.code === 'ECONNECTION' || error.code === 'ESOCKET') {
            errorMessage = 'Cannot connect to email service. Please try again later.';
            console.error("🔌 Network connection issue with Gmail");
        } else {
            errorMessage += 'Please try again later.';
        }

        res.status(500).json({
            success: false,
            message: errorMessage,
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
        
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({
                success: false,
                message: 'Reset link has expired. Please request a new one.'
            });
        }
        
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

        // Send confirmation email (optional - don't fail if it doesn't send)
        try {
            await transporter.sendMail({
                from: `"HeadTouch" <${process.env.EMAIL_USER}>`,
                to: user.email,
                subject: '✅ Your HeadTouch Password Was Changed',
                html: `
                    <!DOCTYPE html>
                    <html>
                    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                            <h1 style="color: white; margin: 0;">✅ Password Changed</h1>
                        </div>
                        <div style="padding: 30px; background: white; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
                            <p style="font-size: 16px; color: #333;">Hi <strong>${user.userName}</strong>,</p>
                            <p style="color: #666;">Your password has been successfully changed. You can now login to HeadTouch with your new password.</p>
                            <p style="color: #ef4444; margin-top: 20px;"><strong>⚠️ Important:</strong> If you didn't make this change, please contact our support team immediately.</p>
                        </div>
                        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
                            <p style="margin: 0;">© 2025 HeadTouch. All rights reserved.</p>
                        </div>
                    </body>
                    </html>
                `
            });
            console.log(`📧 Confirmation email sent to: ${user.email}`);
        } catch (emailError) {
            console.error('⚠️ Failed to send confirmation email (non-critical):', emailError.message);
            // Don't fail the request if confirmation email fails
        }

        res.status(200).json({
            success: true,
            message: 'Password reset successful! You can now login with your new password.'
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