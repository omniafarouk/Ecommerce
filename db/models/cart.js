import mongoose , {model , Schema} from "mongoose"

// can add field totalPrice but instead of constantly changing in the backend , if products changes and so on
// on different collections to be consistent , better to just be calculated in backend


// NOTE : carts are deleted when order is placed

const cartSchema = new Schema({

    user : {
            type : mongoose.Types.ObjectId,
            ref : "User",
            required : true
        },
    products : [
        {
            product : {
                type : mongoose.Types.ObjectId,
                ref : "Product"
            },

            quantity : {
                type : Number,
                default : 1,
                min : 1
            }
        }
    ]
},
{
    timestamps : true
}
);

export const cartModel = model("Cart" , cartSchema);
