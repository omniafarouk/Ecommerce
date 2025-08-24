import { cartModel } from "../../../db/models/cart.js";
import { userModel } from "../../../db/models/user.js";

const getCart = async (req, res) => {
    try {
        // const { id } = req.params;
        let id = req.decoded._id;
        
        let user = await userModel.findById(id);
        if( !user )  return res.status(404).json({message :" user not found"});

        let cart = await cartModel.findOne({ user: id }).populate("products.product");

        // the carts returning in the different cases for the frontend handling
        if (!cart)  return res.status(404).json({ message: "No cart found for user", cart: null });
        
        if (cart.products.length === 0) return res.status(200).json({ message: "Cart is empty", cart });
        
        let totalPrice = cart.products.reduce((sum, item) => {
            return sum + (item.product.price * item.quantity);
        }, 0); // 2nd par (0) , previousValue (sum) inital value 

        return res.status(200).json({ message: "Cart Fetched Successfully", cart , totalPrice});

    } catch (error) {
        res.status(500).json({ message: "Error fetching cart", error });
    }
};

const deleteCart = async (req, res) => {
    // delete by user Id as there is only one cart per user anyway 
    try {
        let id = req.decoded._id;
        // findOneAndDelete ensures we delete the cart that belongs to the given user
        let deletedCart = await cartModel.findOneAndDelete({ user: id });

        if (deletedCart) return res.status(200).json({message: "Cart deleted successfully",deletedCart});

        return res.status(404).json({ message: "No cart found for this user" });

    } catch (error) {
        return res.status(500).json({message: "Cart deletion failed",error: error.message});
    }
};


// for checkout , is it needed really?
const getCartTotalPrice = async (req,res) => {
    //const { id } = req.params;
    let id = req.decoded._id;
    
    let user = await userModel.findById(id);
    if( !user )  return res.status(404).json({message :" user not found"});

    let cart = await cartModel.findOne({ user: id }).populate("products.product");
    
    let totalPrice = cart.products.reduce((sum, item) => {
        return sum + (item.product.price * item.quantity);
    }, 0); // 2nd par (0) , previousValue (sum) inital value 

    return res.status(200).json({ message: "Cart Total Price",totalPrice});

}

// updates on cart 

const addProductToCart = async (req,res) => {
    //const { id } = req.params;      // userId  ---> can be written as const {id : userId} where userId is coming from the param
    let id = req.decoded._id;
    const { product , quantity } = req.body;
    
    let user = await userModel.findById(id);
    if( !user )  return res.status(404).json({message :" user not found"});

    let cart = await cartModel.findOne({ user: id });

    // if cart was not created previously , create it first
    if(!cart){
        let createdCart = await cartModel.insertOne({user: id})
        if(!createdCart) return res.status(500).json({message : "cart creation failed"});
    }
    
    let checkproduct = await cartModel.findOne({user: id,"products.product": product});

    let cartUpdated;
    if(checkproduct) {
        cartUpdated = await cartModel.findOneAndUpdate(
            { user: id, "products.product": product },
            { $inc: {  "products.$.quantity" : quantity } }, // specific for incrementing nested property
            { new: true }
            );
    }
    else{
        cartUpdated = await cartModel.findOneAndUpdate( 
            {user: id },
                { 
                    $push: { 
                        products : {product , quantity}
                    } 
                },
                {new : true}
            );
    }
    if(cartUpdated) return res.status(200).json({message : "Product added on cart successfully", cartUpdated});

    return res.status(500).json({message : "product addition failed"});
}

const removeProductFromCart = async (req,res) => {
    let id = req.decoded._id;
    //const { id } = req.params;      // userId  ---> can be written as const {id : userId} where userId is coming from the param
    const { product } = req.body;
    
    let user = await userModel.findById(id);
    if( !user )  return res.status(404).json({message :" user not found"});

    let cart = await cartModel.findOne({ user: id });

    // if cart was not created previously , create it first
    if(!cart){
        return res.status(500).json({message : "No cart for this user"});
    }
    
    let checkproduct = await cartModel.findOne({user: id,"products.product": product});
    
    if(!checkproduct) return res.status(404).json({message :" product not found"});
    
    let cartUpdated = await cartModel.findOneAndUpdate(
        { user: id },
        { $pull: { products: { product } } },
        { new: true }
    );
    if(cartUpdated) return res.status(200).json({message : "Product deleted From cart successfully", cartUpdated});

    return res.status(500).json({message : "product remove failed"});
}

const decreaseProductQuantity = async (req,res) => {
    let id = req.decoded._id;
    //const { id } = req.params;      // userId  ---> can be written as const {id : userId} where userId is coming from the param
    let { product, quantity} = req.body;
    if(!quantity) quantity = 1
    
    let user = await userModel.findById(id);
    if( !user )  return res.status(404).json({message :" user not found"});

    let checkproduct = await cartModel.findOne({user: id,"products.product": product});
    if(!checkproduct)  return res.status(404).json({message :" product not found"});

    let cartUpdated = await cartModel.findOneAndUpdate(
                { user: id, "products.product": product },
                { $inc: {  "products.$.quantity" : -1 * quantity }}, // specific for incrementing nested property
                { new: true }
            );
    
    if(!cartUpdated) return res.status(500).json({message : "product decrement failed"});

    // find the product after update
    const updatedProduct = cartUpdated.products.find( (p) => p.product.equals(product) );   // search is on the array not the db

    // if quantity <= 0, remove product from cart
    if (updatedProduct && updatedProduct.quantity <= 0) {
        return removeFromCart(req, res);
    }
    return res.status(200).json({message : "Product decremented successfully", cartUpdated});
}

export {
    deleteCart,
    addProductToCart,
    decreaseProductQuantity,
    removeProductFromCart,
    getCart,
    getCartTotalPrice

}