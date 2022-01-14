const ProductModel=require('../models/Product')

class APIfeatures {
    constructor(query,queryString){
         this.query=query;
         this.queryString=queryString;
    }

    filtering(){return true}
    sorting(){return true}
    paginating(){return true}
}

const getProduct=async (req,res)=>{
        try {
            console.log(req.query);
            const products=await ProductModel.Product.find();
            res.json({msg:products})
        } catch (error) {
            res.status(500).json({msg:error.message})
        }
    }

const createProduct=async (req,res)=>{
        try {
            const {product_id,title,price,description,images,category,content}=req.body;
            if(!images) return res.status(400).json({msg: "No image upload"})
            const product=await ProductModel.Product.findOne({product_id})
            if(product)
                return res.status(400).json({msg: "This product already exists."})
            const newProduct= new ProductModel.Product({
                product_id,title:title.toLowerCase(),price,description, content, images, category
            })

            await newProduct.save()
            res.json({msg:"created project"})
        } catch (error) {
            res.status(500).json({msg:error.message})
        }
    }

const deleteProduct=async (req,res)=>{
    try {
        await ProductModel.Product.findByIdAndDelete(req.params.id);
        res.json({msg:"test delete product"})
    } catch (error) {
        res.status(500).json({msg:error.message})
    }
}

const updateProduct=async (req,res)=>{
    try {
        const {title, price, description, content, images, category} = req.body;
            if(!images) return res.status(400).json({msg: "No image upload"})

            await ProductModel.Product.findOneAndUpdate({_id: req.params.id}, {
                title: title.toLowerCase(), price, description, content, images, category
            })
        res.json({msg:"test upadte"})
    } catch (error) {
        res.status(500).json({msg:error.message})
    }
}


module.exports={getProduct,createProduct,deleteProduct,updateProduct};