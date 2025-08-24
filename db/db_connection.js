import mongoose from "mongoose";

export const db_connection = mongoose.connect("mongodb://localhost:27017/Ecommerce")
.then(console.log("database connected successfully"))
.catch((err) => console.error("database connection failed",err));