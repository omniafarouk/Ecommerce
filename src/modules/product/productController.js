// for products , i want to show products info , product price and crud on product
import { productModel } from "../../../db/models/product.js";

// by admins

// DO I ADD : no repetition name with brand ??
const addProduct = async (req,res) => {

    let product = req.body;

    let addedProduct = await productModel.insertOne(product);
    if (addedProduct) return res.status(201).json({message : "product created successfully" , addedProduct})
    return res.status(500).json({message :" product creation failed"})

}

const deleteProduct = async (req,res) => {
    const { id } = req.params;

    let product = await productModel.findById(id);
    if (!product)   return res.status(404).json({message : "product not found"}); 

    let productDeleted = await productModel.findByIdAndDelete(id)

    if(productDeleted) return res.status(200).json({message : "product updated successfully",productDeleted});

    res.status(500).json({message : "product deletion failed"});
}

const updateProduct = async (req,res) => {
    const { id } = req.params;

    let product = await productModel.findById(id);
    if (!product)   return res.status(404).json({message : "product not found"}); 

    let productUpdated = await productModel.findByIdAndUpdate(id , {...req.body} , {new:true});

    if(productUpdated) return res.status(200).json({message : "product updated successfully",productUpdated});

    res.status(500).json({message : "product modification failed"});

}

const updateProductPrice = async (req,res) =>{
    const{ id , price} = {...req.params};
    /*
        const { id } = req.params;
        const { price } = req.body;
    */

    let product = await productModel.findById(id);
    if (!product)   return res.status(404).json({message : "product not found"}); 

    let productUpdated = await productModel.findByIdAndUpdate(id , {price} , {new:true});

    if(productUpdated) return res.status(200).json({message : "price updated successfully",productUpdated});

    res.status(500).json({message : "price modification failed"});

}
const updateProductStock = async (req,res) =>{
    const{ id , stock} = {...req.params};
    /*
        const { id } = req.params;
        const { stock } = req.body;
    */

    let product = await productModel.findById(id);
    if (!product)   return res.status(404).json({message : "product not found"}); 

    let productUpdated = await productModel.findByIdAndUpdate(id , {stock} , {new:true});

    if(productUpdated) return res.status(200).json({message : "stock updated successfully",productUpdated});

    res.status(500).json({message : "stock modification failed"});

}
const incrementProductStock = async (req,res) =>{
    const{ id , stock} = {...req.params};
    /*
        const { id } = req.params;
        const { stock } = req.body;
    */

    let product = await productModel.findById(id);
    if (!product)   return res.status(404).json({message : "product not found"}); 

    let productUpdated = await productModel.findByIdAndUpdate(
    { _id: id },
    { $inc: { stock: stock } }, 
    { new: true }
    );

    if(productUpdated) return res.status(200).json({message : "stock incremented successfully",productUpdated});

    res.status(500).json({message : "stock modification failed"});

}
// by user

/* should add
    // commented for now till implementing JWT
    if (req.decoded.role !== "regUser") {
        return res.status(403).json({ message: "Not authorized" });
    }
*/

const addReview = async (req,res) =>{
    const {id} = req.params;
    const{ userId , rating , comment} = {...req.body};

    let product = await productModel.findById(id);
    if (!product)   return res.status(404).json({message : "product not found"}); 

    // can add a check on user , generates an error BUT its okay?

    const productUpdated = await productModel.findOneAndUpdate(
        { _id: id }, // condition
        { 
            $push: { 
            reviews: { userId, rating, comment } 
            } 
        },
        {new : true}
    );
    /*
        if (productUpdated.modifiedCount === 0) {
            return res.status(404).json({ message: "Product not found or review not added" });
        }
    */
    if(productUpdated) return res.status(200).json({message : "review added successfully " , productUpdated});
    res.status(500).json({message : "product not updated correctly "});
}

// common 

const getProductByFilter = async (req, res) => {
  try {
    const query = {...req.query}; // dynamic search on all fields\
    delete query._id; // ignore _id filters here
    const foundProducts = await productModel.find(query);

    if (!foundProducts || foundProducts.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    return res.status(200).json({ message: "Products found", products: foundProducts });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};


const getProductById = async (req,res) =>{
    const {id} = req.params;
    let product = await productModel.findById(id)
    if (product) return res.status(200).json({message : "product is" , product});
    return res.status(404).json({message : "product not found"});
}

const getProducts = async (req,res) =>{
    let products = await productModel.find();
    if (products.length > 0) return res.status(200).json({message : "products are" , products});
    return res.status(404).json({message : "no products found"});
}

export{
    // admin
    addProduct,
    deleteProduct,
    updateProduct,
    updateProductPrice,
    // both may not be needed
    updateProductStock,
    incrementProductStock,

    // both
    getProducts,
    getProductById,
    getProductByFilter,

    // user
    addReview
}