import { getProductByFilter, getProductById , getProducts , 
    updateProduct , updateProductPrice,
    deleteProduct , addProduct , addReview,
    updateProductStock , incrementProductStock
} from "./productController.js";
import { verifyToken } from "../../middleware/verifyToken.js";
import { checkAuth } from "../../middleware/checkAuth.js";

import express, {Router} from "express" ;

export const productRoutes = Router();

productRoutes.use(express.json())

productRoutes.get("/products" , getProducts);

productRoutes.get("/product/filter",getProductByFilter);

productRoutes.get("/product/:id",getProductById);

productRoutes.post("/product",verifyToken , checkAuth("admin") ,addProduct);

productRoutes.delete("/product/:id",verifyToken , checkAuth("admin"),deleteProduct);

productRoutes.put("/product/:id",verifyToken , checkAuth("admin"),updateProduct);

productRoutes.patch("/product/:id/updateprice/:price",verifyToken , checkAuth("admin") ,updateProductPrice);

productRoutes.patch("/product/:id/updatestock/:stock",verifyToken , checkAuth("admin"),updateProductStock);

// is this needed?
productRoutes.patch("product/:id/incrementstock/:stock",verifyToken , checkAuth("admin"),incrementProductStock);

// user only?
productRoutes.post("/product/:id/addreview",addReview);

