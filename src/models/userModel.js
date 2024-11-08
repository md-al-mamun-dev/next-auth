import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required:[false, ""],
        unique: true
    },
    email: {
        type: String,
        required:[true, "pls provide your email"],
        unique: true,
        index: true 
    },
    password: {
        type: String,
        required: [true, "Please provide password"],
        select: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date
}, )

const User = mongoose.models.users ||  mongoose.model("users", userSchema)
// 
export default User