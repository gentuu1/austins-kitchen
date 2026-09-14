import { model, models, Schema } from "mongoose";

const verifyOtpSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: false
    },
    email: {
        type: String,
        required: false
    },
    newEmail: {
        type: String,
        required: false
    },
    otp: {
        type: String,
        required: true
    },
    newPassword : {
        type : String,
        required : false
    },
    type: {
        type: String,
        enum: ["email-change", "forgot-password"],
        required: true
    },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 10 * 60 * 1000),
        required: true,
        expires: 0
    }
})

export const verifyOtpModel = models.verifyotp || model('verifyotp', verifyOtpSchema) 