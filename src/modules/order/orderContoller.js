import { cartModel } from "../../../db/models/cart.js";
import { orderModel, Status } from "../../../db/models/order.js";
import { productModel } from "../../../db/models/product.js";
import { userModel } from "../../../db/models/user.js";
import mongoose from "mongoose";


// can add getOrdersBy Brand or seller 

// add order

const placeOrder = async (req, res) => {
  try {
    const userId = req.decoded._id;
    const { location } = req.body;

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const cart = await cartModel.findOne({ user: userId }).populate("products.product");
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    let totalPrice = 0;
    const productsToUpdate = [];

    // Check stock and calculate total price
    for (const item of cart.products) {
      const prod = await productModel.findById(item.product._id);
      if (!prod) return res.status(404).json({ message: `Product not found: ${item.product.name}` });
      if (prod.stock < item.quantity)
        return res.status(400).json({ message: `Not enough stock for ${prod.name}` });

      totalPrice += prod.price * item.quantity;
      productsToUpdate.push({ id: prod._id, quantity: item.quantity });
    }

    // Create order
    const orderPlaced = await orderModel.create({
      user: userId,
      totalPrice,
      location,
      products: cart.products.map(p => ({
        product: p.product._id,
        quantity: p.quantity
      })),
      status: Status.PENDING
    });

    if (!orderPlaced) return res.status(500).json({ message: "Order placement failed" });

    // Update stock sequentially
    for (const item of productsToUpdate) {
      await productModel.findByIdAndUpdate(
        item.id,
        { $inc: { stock: -item.quantity } },
        { new: true }
      );
    }

    // Optionally, clear the user's cart after placing order
    await cartModel.findByIdAndDelete(cart._id);

    return res.status(201).json({ message: "Order placed successfully", orderPlaced });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// when status added , order deleted -> order cancelled
const cancelOrder = async (req, res) => {
  const { id } = req.params; // this is the order ID

  const order = await orderModel.findById(id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  // Update order status
  const orderUpdated = await orderModel.findByIdAndUpdate(
    id,
    { status: Status.CANCELLED },
    { new: true }
  );

  if (!orderUpdated) return res.status(500).json({ message: "Order modification failed" });

  // Optional: restore stock if needed
  for (const item of order.products) {
    await productModel.findByIdAndUpdate(
      item.product,
      { $inc: { stock: item.quantity } }
    );
  }

  return res.status(200).json({ message: "Order cancelled successfully", orderUpdated });
};


const updateOrderLocation = async (req,res)=>{

    const { id } = req.params;
    const {location} = req.body;

    let order = await orderModel.findById(id);
    if (!order)   return res.status(404).json({message : "order not found"}); 

    let orderUpdated = await orderModel.findByIdAndUpdate(id , {location} , {new:true});

    if(orderUpdated) return res.status(200).json({message : "order updated successfully",orderUpdated});

    res.status(500).json({message : "order modification failed"});

}

const getUserOrders = async (req,res)=>{
    try{
        let {id} = req.params;   
        let user = await userModel.findById(id);
        if( !user )  return res.status(404).json({message :" user not found"});

        let orders = await orderModel.find( {user:id })
        if(orders.length > 0) return  res.status(201).json({message : "User Orders " , orders});
        return res.status(404).json({message :" No Orders Found"});  
    } catch (err) {
    return res.status(500).json({ message: "Server Failed Finding User Orders", error: err.message });
  }
}

const getOrderById = async (req,res)=>{
    const {id} = req.params;
    let order = await orderModel.findById(id)
    if (order) return res.status(200).json({message : "order is" , order});
    return res.status(404).json({message : "order not found"});
}

// for admins 

const getOrders = async (req,res)=>{
    let orders = await orderModel.find().populate("user");
    if (orders.length > 0) return res.status(200).json({message : "orders are" , orders});
    return res.status(404).json({message : "no orders found"});
}

const updateOrderStatus = async (req,res)=>{
    const { id } = req.params;
    const {status} = req.body;

    let order = await orderModel.findById(id);
    if (!order)   return res.status(404).json({message : "order not found"}); 

    let orderUpdated = await orderModel.findByIdAndUpdate(id , {status} , {new:true});

    if(orderUpdated) return res.status(200).json({message : "order updated successfully",orderUpdated});

    res.status(500).json({message : "order modification failed"});
   
}

export {
    placeOrder,
    cancelOrder,
    updateOrderLocation,
    getOrderById,
    getUserOrders,
    
    // admins
    getOrders,
    updateOrderStatus
    // Do I add general update method?

}