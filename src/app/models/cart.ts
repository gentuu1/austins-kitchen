import { model, models, Schema } from "mongoose";

const cartSchema = new Schema({
    userId : {type : Schema.Types.ObjectId, ref : 'user', required : true},
    items :[
        {
            productId : {type : Schema.Types.ObjectId, ref:"product", required : true},
            quantity : {type : Number, default: 1}
        }
    ]
})

export const cartModel = models.cart || model('cart', cartSchema)