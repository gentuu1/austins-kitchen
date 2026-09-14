import { model, models, Schema } from "mongoose";

const productSchema = new Schema({
    title : {type : String, required : true},
    description: {type : String, required : true},
    image: {type : String, required : true},
    price : {type : Number, required : true},
    status : {type : String, required: true},
    purchaseCount : {type : Number, default : 0},
    revenue : {type : Number, default : 0},
    createdAt : {type : Date, default : Date.now}
})

export const productModel = models.product || model('product', productSchema)

