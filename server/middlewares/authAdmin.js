const Usermodel=require('../models/UserModel')


const authAdmin=async (req,res,next)=>{
   
    try{
           const user=await Usermodel.User.findOne({
                                                     _id:req.user.id
                                                   })
            console.log(user);
          if(!user){
              return res.status(400).json({msg:"not authenticated"});
          }
          if(user.role==0){
              return res.status(400).json({msg:"Your not a admin"});
          }
          next()
            
    }catch(err){
          res.status(500).json({msg:err.message})
    }
    

}

module.exports={authAdmin}