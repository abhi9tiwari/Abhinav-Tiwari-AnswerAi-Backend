const jwt = require("jsonwebtoken");
const { signupSchema, signinSchema } = require("../middlewares/validator");
const { doHash, doHashValidation } = require("../utils/hashing");
const User = require("../models/userModel");
const Question = require("../models/questionModel");

exports.signup = async (req, res) => {
    const { email, password } = req.body;
    try {
        const { error, value } = signupSchema.validate({ email, password });
        if (error) {
            return res
                .status(400)
                .json({ success: false, message: error.details[0].message });
        } else {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res
                    .status(401)
                    .json({ success: false, message: "Email already exists" });
            }
            const hashedPassword = await doHash(password, 12);
            const newUser = new User({
                email: email,
                password: hashedPassword,
            });
            const result = await newUser.save();
            result.password = undefined;
            res.status(201).json({
                success: true,
                message: "Your account has been created successfully.",
                result,
            });
        }
    } catch (error) {
        console.log(error);
    }
};

exports.signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const { error, value } = signinSchema.validate({ email, password });
        if (error) {
            return res
                .status(401)
                .json({ success: false, message: error.details[0].message });
        }
        const existingUser = await User.findOne({ email }).select("+password");
        if (!existingUser) {
            return res
                .status(401)
                .json({ success: false, message: "User does not exists" });
        } else {
            const result = await doHashValidation(password, existingUser.password);
            if (!result) {
                return res
                    .status(401)
                    .json({ success: false, message: "Invalid Credentials" });
            }
            //jwt token creation
            const token = jwt.sign(
                {
                    userId: existingUser._id,
                    email: existingUser.email,
                    verified: existingUser.verified,
                },
                process.env.TOKEN_SECRET
            );
            res
                .cookie("Authorization", "Bearer" + token, {
                    expires: new Date(Date.now() + 8 * 3600000),
                    httpOnly: process.env.NODE_ENV === "production",
                    secure: process.env.NODE_ENV === "production",
                })
                .json({
                    success: true,
                    message: "Logged in successfully.",
                    token,
                    user: existingUser._id,
                    email: existingUser.email,
                    verified: existingUser.verified,
                });
        }
    } catch (error) {
        console.log(error);
    }
};

exports.getUserProfileById = async (req, res) => {
    const { _id } = req.query;
    try {
        const user = await User.findById(_id);
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.getUserQuestions = async (req, res) => {
    const { userId } = req.query;
    try {
        const questions = await Question.find({ userId });
        if (!questions || questions.length === 0) {
            return res
                .status(404)
                .json({ success: false, message: "No questions found for this user" });
        }
        res.status(200).json({ success: true, questions });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.refreshToken = async (req, res) => {
    const refreshToken = req.cookies["refreshToken"];

    if (!refreshToken) {
        return res
            .status(401)
            .json({ success: false, message: "Refresh token missing" });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const userId = decoded.userId;

        const user = await User.findById(userId).select("+refreshToken");
        if (!user || user.refreshToken !== refreshToken) {
            return res
                .status(403)
                .json({ success: false, message: "Invalid refresh token" });
        }

        // Generate a new access token
        const newAccessToken = jwt.sign(
            { userId: user._id, email: user.email, verified: user.verified },
            process.env.TOKEN_SECRET,
            { expiresIn: "15m" } // Adjust the expiration as needed
        );

        res.status(200).json({
            success: true,
            accessToken: newAccessToken,
            message: "Token refreshed successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: "Unauthorized" });
    }
};

exports.signout = async (req, res) => {
    res
        .clearCookie("Authorization")
        .status(200)
        .json({ success: true, message: "logged out successfully" });
};
