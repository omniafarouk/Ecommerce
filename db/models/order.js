
import mongoose, { model , Schema } from "mongoose";


export const Status = Object.freeze({
    PROCESSING: "processing",
    SHIPPED: "shipped",
    CANCELLED: "cancelled",
    Delivered : "delivered"
});

const locationSchema = new Schema({
    city : {
        type : String ,
        required : true
    }, 
    address : {
        type : String ,
        required : true
    }, 
    zipcode : String
});

const orderSchema = new Schema({

    user : {
        type : mongoose.Types.ObjectId,
        ref : "User",
        required : true
    },
    products : [{
        product : {
            type : mongoose.Types.ObjectId,
            ref : "Product",
            required : true
        },
        quantity : {
            type : Number,
            default : 1,
            min : 1
        }
    }],
    location : locationSchema,
    totalPrice : {
        type :  Number,
        required : true
    },
    status: {
        type: String,
        enum: ["processing", "shipped", "delivered", "cancelled"],
        default: "processing"
    }
    // can add a payment method too 
},{
    timestamps : true
});

export const orderModel = model ("Order" , orderSchema);