import { verifyToken } from "../../middleware/verifyToken.js";
import { checkAuth } from "../../middleware/checkAuth.js";
import { verifyEmail } from "../../middleware/verifyEmail.js";
import { getUsers,updateUserById  ,deleteUserById
     , login , register, addAdmin, 
     verifyAccount,
     VerifyPassword,
     updatePassword} from "./userController.js";

import express, {Router} from "express";
        
export const userRoutes = Router()  // or express.Router()

userRoutes.use(express.json())

// user login and signup
userRoutes.post("/register", verifyEmail , register);

userRoutes.post("/login", login); // not login() because i am not calling the fn , i am passing a fn reference

userRoutes.delete("/user", verifyToken, deleteUserById);

userRoutes.put("/user", verifyToken , updateUserById);


// called by admin ONLY
userRoutes.get("/admin/users", verifyToken , checkAuth("admin") , getUsers);
userRoutes.post("/admin/addadmin", verifyToken , checkAuth("admin") ,addAdmin);

userRoutes.patch("/user/password/reset",updatePassword);

// for authentication 
userRoutes.get("/user/verify/:email",verifyAccount);

userRoutes.get("/user/password/reset/:token",VerifyPassword);

