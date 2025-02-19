import slugify from "slugify"
import productModel from "../models/productModel.js"
import Cart from "../models/Cart.js"
import categoryModel from "../models/categoryModel.js"
import fs from 'fs'
import dotenv from 'dotenv'
import orderModel from "../models/orderModel.js"
import { User } from "../models/userModels.js";
import mongoose from "mongoose";

dotenv.config()

export const createProductController = async (req, res) => {
    try {
        const {
            name,
            slug,
            description,
            price,
            quantity,
            category,
            shipping } = req.fields

        const { photo } = req.files

        if (!name || !description || !price || !quantity || !category) {
            return res.send({
                success: false,
                message: "Fill all the required fileds"
            })
        }

        if (photo && photo.size > 1000000) {
            res.send({ message: "Photo is required and should be less than 1 mb" })
        }

        const product = new productModel({ ...req.fields, slug: slugify(name) });

        if (photo) {
            product.photo.data = fs.readFileSync(photo.path)
            product.photo.contentType = photo.type
        }

        await product.save()

        res.send({
            success: true,
            message: "Product Saved Successfully",
            product
        })

    } catch (error) {
        console.log(error)
        res.send({
            success: false,
            error,
            message: "Error in Creating Products"
        })
    }
}


export const getProductsController = async (req, res) => {
    try {

        const products = await productModel.find({}).select("-photo").sort({ createdAt: - 1 }).populate("category")
        res.send({
            success: true,
            message: "Listed Products",
            countTotal: products.length,
            products
        })

    } catch (error) {
        console.log(error)
        res.send({
            success: false,
            error,
            message: "Error in getting Products"
        })
    }
}

export const getSingleProductController = async (req, res) => {
    try {

        const product = await productModel.findOne({ slug: req.params.slug }).select("-photo").populate("category")

        if (!product) {
            return res.status(401).send({
                success: false,
                message: "No such product found",

            })
        }

        res.status(201).send({
            success: true,
            message: "Got Single Product",
            product
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error in getting single Products"
        })
    }
}



export const productPhotoController = async (req, res) => {
    try {
        const { pid } = req.params;

        if (!pid || !mongoose.Types.ObjectId.isValid(pid)) {
            return res.status(400).send({
                success: false,
                message: "Invalid Product ID"
            });
        }

        const product = await productModel.findById(pid).select("photo");

        if (product?.photo?.data) {
            res.set("Content-Type", product.photo.contentType);
            return res.status(200).send(product.photo.data);
        } else {
            return res.status(404).send({
                success: false,
                message: "Product photo not found"
            });
        }

    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in getting Product Photo"
        });
    }
};


export const deleteProductController = async (req, res) => {
    try {

        await productModel.findByIdAndDelete(req.params.pid).select("-photo")
        res.status(200).send({
            success: true,
            message: "Product deleted Succefully"
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error in deleting Product Photo"
        })
    }
}

export const updateProductController = async (req, res) => {
    try {
        const {
            name,
            slug,
            description,
            price,
            quantity,
            category,
            shipping } = req.fields

        const { photo } = req.files

        if (!name || !description || !price || !quantity || !category) {
            return res.send({
                success: false,
                message: "Fill all the required fileds"
            })
        }

        if (photo && photo.size > 1000000) {
            res.send({ message: "Photo is required and should be less than 1 mb" })
        }

        const product = await productModel.findByIdAndUpdate(req.params.pid,
            { ...req.fields, slug: slugify(name) }, { new: true })

        if (photo) {
            product.photo.data = fs.readFileSync(photo.path)
            product.photo.contentType = photo.type
        }

        await product.save()

        res.send({
            success: true,
            message: "Product Updated Successfully",
            product
        })


    } catch (error) {
        console.log(error);
        res.send({
            success: false,
            error,
            message: "Error in Update product",
        });
    }
}

export const productFilterController = async (req, res) => {
    try {
        const { checked } = req.body
        let args = {}
        if (checked?.length > 0) args.category = checked
        const products = await productModel.find(args)

        res.send({
            success: true,
            products
        })

    } catch (error) {
        console.log(error);
        res.send({
            success: false,
            error,
            message: "Error in Update product",
        });
    }
}

export const productCountController = async (re, res) => {
    try {

        const total = await productModel.find({}).estimatedDocumentCount()
        res.send({
            success: true,
            total
        })

    } catch (error) {
        console.log(error);
        res.send({
            success: false,
            error,
            message: "Error in getting total count",
        });
    }
}


export const productListController = async (req, res) => {
    try {
        const perpage = 7
        const page = req.params.page ? req.params.page : 1
        const products = await productModel.find({}).select("-photo").skip((page - 1) * perpage).limit(perpage).sort({ createdAt: -1 })

        res.send({
            success: true,
            products
        })

    } catch (error) {
        console.log(error);
        res.send({
            success: false,
            error,
            message: "Error in getting Product List",
        });
    }
}

export const searchProductController = async (req, res) => {
    try {
        const { keyword } = req.params
        const result = await productModel.find({
            $or: [
                { name: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ]
        }).select("-photo")

        res.json(result)

    } catch (error) {
        console.log(error);
        res.send({
            success: false,
            error,
            message: "Error in Product Search Api",
        });
    }
}

export const categoryProductController = async (req, res) => {
    try {
        const category = await categoryModel.findOne({ slug: req.params.slug })
        const products = await productModel.find({ category }).populate('category')


        res.send({
            success: true,
            products,
            category
        })

    } catch (error) {
        console.log(error);
        res.send({
            success: false,
            error,
            message: "Error in category Product Search Api",
        });
    }
}


export const addProductToCart = async (req, res) => {
    try {
        const { productId } = req.body;

        const userId = req.user._id ? req.user._id : null

        

        if (!userId) {
            return res.status(401).json({
                
                success: false,
                message: "Please log in to add to cart",
            });
        }
        const user = await User.findById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        
        // const productObjectId = mongoose.Types.ObjectId(productId);
        const productObjectId = productId
        
        console.log("In add product-379",productId)
        // Check if the item already exists in the cart to prevent duplicates
        if (!user.cartItem.includes(productObjectId)) {
            user.cartItem.push(productObjectId);
            await user.save();
            // return { success: true, message: 'Item added to cart successfully' };
            return res.status(200).json({
                
                success: true,
                message: "Item added to cart successfully",
            });
        } else {
            return res.json({ success: false, message: 'Item already exists in the cart' });
        }
    } catch (error) {
        return { success: false, message: error.message };
    }
};



export const getCartProductsController = async (req, res) => {
    try {
        const userId = req.user ? req.user._id : null;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Please log in to view your cart items",
            });
        }
        
        const user = await User.findById(userId).populate("cartItem");
        
        
                res.status(200).json({
                    
            success: true,
            message: "Cart items retrieved successfully",
            cartItems: user.cartItem,
        });
    } catch (error) {
        console.error("Error fetching cart items:", error);
        res.status(500).json({
            success: false,
            message: "Error retrieving cart items",
            error,
        });
    }
};


export const removeCartItemController = async (req, res) => {
    try {
        const userId = req.user ? req.user._id : null;
        const { productId } = req.body; 

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Please log in to remove items from your cart",
            });
        }

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required to remove item from cart",
            });
        }


        const updatedUser = await User.findOneAndUpdate(
            { _id: userId }, 
            { $pull: { cartItem:  productId  } }, 
            { new: true }
          );


        

  

        // Save the updated cart
        await updatedUser.save();

        res.status(200).json({
            success: true,
            message: "Item removed from cart successfully",
            cartItems: updatedUser.cartItem,
        });
    } catch (error) {
        console.error("Error removing item from cart:", error);
        res.status(500).json({
            success: false,
            message: "Error removing item from cart",
            error,
        });
    }
};




export const paymentAndEmptyCartController = async (req, res) => {
    try {
        const { cart } = req.body;
        const userId = req.user ? req.user._id : null;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Please log in to make a payment",
            });
        }

        // Process the payment and create the order
        const order = await new orderModel({
            product: cart,
            buyer: userId,
            payment: "Success"
        }).save();

        // Empty the cart for the user
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: { cartItem: [] } },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Payment completed successfully",
            cartItems: updatedUser.cartItem,
            order: order,
        });
    } catch (error) {
        console.error("Error in payment and empty cart controller:", error);
        res.status(500).json({
            success: false,
            message: "Error completing payment and emptying cart",
            error,
        });
    }
};

