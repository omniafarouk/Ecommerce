import express from "express";
import { userRoutes } from "./src/modules/user/userRoutes.js";
import { db_connection } from "./db/db_connection.js";
import { productRoutes } from "./src/modules/product/productRoutes.js";
import { orderRoutes } from "./src/modules/order/orderRoutes.js";
import { cartRoutes } from "./src/modules/cart/cartRoutes.js";

const serverApp = express()
const PORT = 3000 ;

db_connection

serverApp.use(userRoutes);
serverApp.use(productRoutes);
serverApp.use(orderRoutes);
serverApp.use(cartRoutes);

serverApp.listen(PORT , ()=>{
    console.log("server running on port ", PORT);
})