import mongoose , {model , Schema} from "mongoose"

const userSchema = new Schema({

    name : String,
    email : String,
    phone : String,
    password : String,
    role : {
        type : String,
        enum : ["regUser", "admin"],
        default : "regUser",
    },
    isConfirmed : {
        type : Boolean ,
        default : false
    }
    // can add age or gender for recommendations?

},{
    timestamps : true
});

export const userModel = model("User" , userSchema);