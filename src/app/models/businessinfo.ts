import { model, models, Schema } from "mongoose";

const businessInfoSchema = new Schema({
    businessPhone : String,
    businessEmail : String,
    businessAddress : {
        address : String,
        town : String,
        state : String
    },
    openingFrom : String,
    openingTo : String
})

export const businessInfoModel = models.businessinfo || model('businessinfo', businessInfoSchema)