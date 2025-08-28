import express,{Router} from "express";

import { getCart , getCartTotalPrice , addProductToCart,
    removeProductFromCart , deleteCart, decreaseProductQuantity } from "./cartController.js";

import { verifyToken } from "../../middleware/verifyToken.js";

// check for user?
import { checkAuth } from "../../middleware/checkAuth.js";

export const cartRoutes = Router();

cartRoutes.use(express.json())

cartRoutes.get("/cart",verifyToken,getCart);

cartRoutes.get("/cart/totalPrice",verifyToken,getCartTotalPrice);

cartRoutes.patch("/cart/removeproduct",verifyToken,removeProductFromCart);

cartRoutes.patch("/cart/decreaseQuantity",verifyToken,decreaseProductQuantity);

// do i delete using userId or cartId? --> use user Id better to ensure that one cart per user anyway
cartRoutes.delete("/cart",verifyToken,deleteCart);

cartRoutes.post("/cart/addproduct",verifyToken,addProductToCart);
