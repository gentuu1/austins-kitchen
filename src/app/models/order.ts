import { model, models, Schema } from "mongoose";

const orderSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    
    items: [
        {
            productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
            title: { type: String, required: true },
            price: { type: Number, required: true },
            image: { type: String, required: true },
            quantity: { type: Number, required: true }
        }
    ],
    deliveryfee :{type : Number, required: true},
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['pending', 'failed', 'refunded', "success"], default: "pending", required: true },
    status: {type: String, required: true,
        enum: [
            "pending",
            "confirmed",
            "preparing",
            "ready",
            "out-for-delivery",
            "delivered",
            "cancelled"
        ],
        default: 'pending'
    },
    deliveryAddress: {
        street: {
            type: String,
            required: true
        },

        town: {
            type: String,
            required: true
        },

        state: {
            type: String,
            required: true
        }
    },

    paymentReference: String,
    phoneNumber : {type:String, required: true},    
    createdAt: { type: Date, required: true, default: Date.now }
})

export const orderModel = models.order || model('order', orderSchema)