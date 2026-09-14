import {model, models, Schema } from 'mongoose';

const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role : { type: String, enum: ["admin", "user"], required: true   },
    amountSpent : {type:Number, default: 0 , required : true},
    phoneNumber : String,
    profilePic : String
});

export const userModel = models.user ||  model('user', userSchema)