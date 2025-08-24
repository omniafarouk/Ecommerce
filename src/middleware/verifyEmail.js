import { userModel } from "../../db/models/user.js"

// next should be added in ANY middleware to indicate "Good Continue"
export const verifyEmail = async (req,res, next) =>{
    const user = await userModel.findOne({email : req.body.email}) 
    if(user) return res.status(409).json({message : "email already exists"}) // conflict
    // else
    next()
}