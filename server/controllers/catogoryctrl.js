const categoryModel=require('../models/categoryModel');

const getcategory=async (req,res,next)=>{
    try{  
          const categoryes= await  categoryModel.category.find(); 
          return res.json({msg:categoryes});
    }catch(err){
        return res.status(500),json({msg:err.message});
    }
}

const putcategory = async (req,res,next)=>{
    try{
        const {name}=req.body;
        if(!name) {
            return res.status(400).json({msg:"Bad request"});
        }

        const category=await categoryModel.category.findOne({name});
        console.log(category);
        if(category){
            return res.status(401).json({msg:"category already exist"});
        }
        const cat=new categoryModel.category({name});
        await cat.save();
        res.status(200).json({msg:"created cat"})
    }catch(err){
        return res.status(500).json({msg:err.message});
    }
}

const deletecategory=async (req,res,nex)=>{
    try{
         await categoryModel.category.findByIdAndDelete(req.params.id);
         res.status(200).json({msg:"deleted"});
    }catch(err){
         res.status(500).json({msg:err.message})
    }
}

const updatecategory=async (req,res,next)=>{
    try{ 
         const {name}=req.body
         await categoryModel.category.findByIdAndUpdate({_id:req.params.id},{name}) 
         res.status(200).json({msg:"updated sucess"});
    }catch(err){
        res.status(500).json({msg:err.message});
    }
}
module.exports={getcategory,putcategory,deletecategory,updatecategory}