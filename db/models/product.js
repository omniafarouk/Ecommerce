import mongoose, { model, Schema} from "mongoose";

const productSchema = new Schema({

    name : String,
    description : String ,
    brand : String,
    category : String,
    // gender : female , male , unisex , child ,
    reviews : [{
        // can create a special reviewSchema with no collection in , can also add timestamps for it 
      rating : { type : Number , min : 0 , max : 5 },
      comment : String,
      userId : {
        type : mongoose.Types.ObjectId ,
        ref : "User",
        required : true
      }   
    }],
    price : { type : Number , required : true},
    stock : { type : Number , required : true , min : 0 , default : 0}

    
    // can add seller

},
{
    timestamps : true
});

export const productModel = model("Product" , productSchema);