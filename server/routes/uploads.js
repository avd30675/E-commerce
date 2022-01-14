const Router=require('express').Router()
const cloudinary=require('cloudinary')
const auth=require('../middlewares/auth')
const authAdmin=require('../middlewares/authAdmin')
const fs=require('fs')

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
})

Router.post('/upload',(req,res)=>{
    try{     
             
             if(!req.files || Object.keys(req.files).length==0){
                 return res.status(500).json({msg:"please upload"})
             }
             const file=req.files.file;
             if(file.size > 1024*1024 ){
                return res.status(400).json({msg:"to large"});
               /// emoveTemp(file.tempFilePath);
             } 
             if(file.mimetype!=='image/png' && file.mimetype!=='image/jpeg'){
                  return res.status(400).json({msg:"mem type shold be png and jpg"})
                  removeTemp(file.tempFilePath);
             }  
             
             cloudinary.v2.uploader.upload(file.tempFilePath,{folder:"ecommerce/laptop"},(err,result)=>{
                 if(err) return res.status(500).json({msg:err.message});
                 removeTemp(file.tempFilePath);
                 res.json({public_id:result.public_id,url:result.secure_url})
             })
    }catch(err){
            res.status(500).json({msg:err.message})
    }
})

Router.post('/destroy',auth.auth,authAdmin.authAdmin,async (req,res)=>{
    try{
         const {public_id}=req.body;
         console.log(public_id);
         if(!public_id) return res.status(400).json({msg:"bad request"});
         cloudinary.v2.uploader.destroy(public_id,(err,result)=>{
             if(err) throw err;
             return res.status(200).json({msg:"deleted success full"})
         })       
    }catch(err){
          return res.status(500).json({msg:err.message})
    }
})
const removeTemp=(path)=>{
    fs.unlink(path,err=>{
        if(err) throw err;
    })
}

module.exports=Router