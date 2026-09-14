import { model, models, Schema } from "mongoose";

const savedSchema = new Schema({
    productId : {
        type : Schema.Types.ObjectId,
        ref : 'product',
        required : true
    },

    userId : {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

export const savedProductModel = models.savedproduct || model("savedproduct", savedSchema)