import { orderModel, Status } from "../../../db/models/order.js";
import { productModel } from "../../../db/models/product.js";
import { userModel } from "../../../db/models/user.js";


// can add getOrdersBy Brand or seller 

// add order
const placeOrder = async (req,res)=>{
    //let {id} = req.params;   
    let id = req.decoded._id;
    const { products , location } = req.body;

    let user = await userModel.findById(id);
    if( !user )  return res.status(404).json({message :" user not found"});

    let totalPrice = 0;
    for (let item of products) {
        const prod = await productModel.findById(item.product);
        if (!prod) return res.status(404).json({ message: "Product not found" });
        totalPrice += prod.price * item.quantity;
    }

    let orderPlaced = await orderModel.insertOne( {user: id , totalPrice : totalPrice , location , products});
    // let orderPlaced = await orderModel.insertOne( {user: new mongoose.Types.ObjectId(id), ...order }); // for proper indexing
    if(orderPlaced) return  res.status(201).json({message : "order placed successfully" , orderPlaced});
    return res.status(500).json({message :" order placement failed"})  

}

// when status added , order deleted -> order cancelled
const cancelOrder = async (req,res)=>{
    const { id } = req.params;

    let order = await orderModel.findById(id);
    if (!order)   return res.status(404).json({message : "order not found"}); 

    let productUpdated = await productModel.findByIdAndUpdate(id , {status : Status.CANCELLED} , {new:true});

    if(productUpdated) return res.status(200).json({message : "order updated successfully",productUpdated});

    res.status(500).json({message : "order modification failed"});
}

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
    let orders = await orderModel.find();
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