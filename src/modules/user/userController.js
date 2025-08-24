import { userModel } from '../../../db/models/user.js';
import bcrypt from 'bcrypt';
import { sendMail } from '../../utilites/email/sendMail.js';
import jwt from 'jsonwebtoken';
import { sendPasswordMail } from '../../utilites/password/sendPasswordMail.js';
// should add email verification in login and jwt token

const register = async(req,res) =>{
    let newUser = req.body;    
    // Check if email already exists
    let existingUser = await userModel.findOne({ email: newUser.email });

    if (existingUser)  
        return res.status(409).json({ message: "User already exists with this email", email: newUser.email });

    newUser.password = bcrypt.hashSync(newUser.password,8) // 2nd par is salt par , typically takes value from 8 - 10
    
    const createdUser = await userModel.insertOne(newUser);
    if(!createdUser) return res.status(500).json({message : "User signing in failed , please try again later"});
    // else
    sendMail(newUser.email);
    return res.status(201).json({message: "Welcome " , name :createdUser.name , createdUser});
    
            
};

const login = async(req,res) => {
    let checkedUser = req.body;
    let user = await userModel.findOne(
    {
        $and : [
        { email : checkedUser.email} , {role : checkedUser.role}
        ]
    });
    if(!user) res.status(404).json({message : " Wrong credentials , please check email and password again "});
    
    // this is done for first admin only as i am the one inserting the password manually
    if(checkedUser.role == "admin"){
        if(user.password != checkedUser.password){
            res.status(404).json({message : " Wrong credentials , please check email and password again "});
        }
    }
    else{       
        // take care compareSync has a specific sequence (plain password then hashed password)
        if(!bcrypt.compareSync(checkedUser.password , user.password)){
            res.status(404).json({message : " Wrong credentials , please check email and password again "});
        }
    }
    const token =  jwt.sign({_id:user._id, role:user.role , isConfirmed : user.isConfirmed} , 'NTI-intern');
    if(user.isConfirmed === true) return res.json({message:`welcome ${user.name} `, token});
    sendMail(user.email);
    return res.json({message:"Please Confirm Your Email",email:user.email});
    
}

const deleteUserById = async (req,res) =>{
    // const {id} = req.params     // destructing 
    let id = req.decoded._id;
    //let userToDelete = req.body;
    let userDeleted = await userModel.findByIdAndDelete(id);
    if (userDeleted) return res.status(200).json({message : "user deleted Successfully ", userDeleted});
    return res.status(404).json({message : "user not found"})
}

const updateUserById = async (req,res) => {
    //const {id} = req.params;
    let id = req.decoded._id;
    let userUpdate = req.body;

    if(userUpdate.password) return res.status(400).json({message : "To change password use /password/reset"})

    let userUpdated = await userModel.findByIdAndUpdate(id,{...userUpdate},{new : true}); 
    // new is added to update then return the last updated value
    if(userUpdated) return res.status(200).json({message : "user updated Successfully ", userUpdated});
    return res.status(404).json({message : "User Not Found"});
}

const updatePassword = async (req,res) => {
    const id = req.decoded._id;
    const { password : newPassword } = req.body;

    if (!password) {
        return res.status(400).json({ message: "password must be provided" });
    }

    const user = await userModel.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Hash new password
    HashedPassword = bcrypt.hashSync(newPassword,8);
    return sendPasswordMail(user.email,HashedPassword);

};


// to admins

// only from admins to add admins
const addAdmin = async (req, res) => {
    let newUser = req.body;    
    // Check if email already exists
    let existingUser = await userModel.findOne({ email: newUser.email });

    if (existingUser)  
        return res.status(409).json({ message: "User already exists with this email", email: newUser.email });

    newUser.password = bcrypt.hashSync(newUser.password,8);

    const createdUser = await User.insertOne({role: "admin", ...newUser});

    if(createdUser) return res.status(201).json({message: "Welcome " , name :createdUser.name , createdUser});
    return res.status(500).json({message : "Admin creation failed"});
};

const getUsers = async (req,res) => {
    const users = await userModel.find()
    res.json({message : "users are " , users});
};

const verifyAccount = async (req,res) => {
    let {email} =  req.params
         
    jwt.verify(email, "NTI-intern-Mail", async(err,decoded)=>{
            
    if(err) return res.status(401).json({message:"invalid token",err})

    await userModel.findOneAndUpdate({email:decoded.email}, {isConfirmed:true})
    res.status(200).json({message:"confirmed successfully"})
    }
    )
}

const VerifyPassword = async (req,res) => {
    let {token} =  req.params
         
    jwt.verify(token, "NTI-intern-password", async(err,decoded)=>{
            
    if(err) return res.status(401).json({message:"invalid token",err})

    let userUpdated = await userModel.findOneAndUpdate({email:decoded.email},{password:decoded.password},{new : true}); 
    if(userUpdated)
        return res.status(200).json({ message: "Password updated successfully" });
    else
        res.status(500).json({message : "password update failed"});
    }
    )
}

// note : 401 : means the authentication is uncompleted due to lack of authorization (verification token)
// 403 : means server understands the request but the user is forbidden/unauthorized to continue (not his role/place)



export {
    login,
    register,
    updateUserById,
    deleteUserById,
    // admin
    getUsers,
    addAdmin,

    verifyAccount,
    VerifyPassword,
    updatePassword
}