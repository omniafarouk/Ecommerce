import express, {Router} from "express" ;
import { placeOrder , cancelOrder
    ,updateOrderLocation , updateOrderStatus
    ,getUserOrders, getOrders , getOrderById } from "./orderContoller.js";
import { verifyToken } from "../../middleware/verifyToken.js";
import { checkAuth } from "../../middleware/checkAuth.js";

export const orderRoutes = Router();

orderRoutes.use(express.json());

// can be for admins and users
orderRoutes.get("/orders/user/:id",getUserOrders);    // user id 

// rest id = order id
orderRoutes.get("/order/:id",getOrderById);

orderRoutes.post("/order/placeorder",verifyToken,placeOrder);

//this is order id
orderRoutes.patch("/order/cancelorder/:id",verifyToken,cancelOrder);

orderRoutes.patch("/order/editorderlocation/:id",verifyToken,updateOrderLocation);

// token is for admin not user in this case 
orderRoutes.patch("/order/editorderstatus/:id",verifyToken,checkAuth("admin"),updateOrderStatus);

orderRoutes.get("/orders",verifyToken,checkAuth("admin"),getOrders);