import { model, models, Schema } from "mongoose";

const landingImagesSchema = new Schema({
    mainLanding :{
        image : String,
        publicId : String
    },
    productDisplay :[
        {
            title : String,
            image : String,
            publicId : String,
        }
    ], 
    whyPeopleDisplay : {
        image : String,
        publicId : String
    },
    bottomLanding: {
        image: String,
        publicId: String
    }
})

export const landingImageModel = models.landingimage || model('landingimage', landingImagesSchema)