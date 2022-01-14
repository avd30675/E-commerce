const UsersModel=require('../models/UserModel')
const bcrypt=require('bcrypt')
const UserModel = require('../models/UserModel')
const jwt=require('jsonwebtoken')
const dotenv = require('dotenv');
const cookie=require('cookie-parser')
dotenv.config();

const register=async (req,res)=>{
    try{
        const {name,email,password,role}=req.body

        const user=await UsersModel.User.findOne({email});

    
        if(user)  return res.json({msg:"not possible to registed email alredy taken"})
        const hashed=await bcrypt.hash(password,10);
         
        const newuser=await new UserModel.User({
            name,email,password:hashed,role
        })
          await newuser.save();

        //JWT authentication
        const accesstoken=  creteAccessToken({id:newuser._id});
        const refreshtoken = createReferenceToken({id:newuser._id}) ;
        
        res.cookie('refreshtoken',refreshtoken,{
            httpOnly:true,
            path: '/user/refresh'
        })

        res.json({ accesstoken});
    } catch(err){
        return res.status(500).json({msg:err.message})
    }
     
}

const login=async (req,res)=>{
    try {
            const {email, password} = req.body;

            const user = await UserModel.User.findOne({email})
            if(!user) return res.status(400).json({msg: "User does not exist."})

            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch) return res.status(400).json({msg: "Incorrect password."})

            // If login success , create access token and refresh token
            const accesstoken = creteAccessToken({id: user._id})
            const refreshtoken = createReferenceToken({id: user._id})

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh',
                maxAge: 7*24*60*60*1000 // 7d
            })

            res.json({accesstoken})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
}


const refreshToken=(req,res)=>{
      
          
            try {
            const rf_token = req.cookies.refreshtoken;
            if(!rf_token) return res.status(400).json({msg: "Please Login or Register"})

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) =>{
                if(err) return res.status(400).json({msg: "Please Login or Register"})

                const accesstoken = creteAccessToken({id: user.id})

                res.json({accesstoken})
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    
}

const logout=(req,res)=>{
    try {
            res.clearCookie('refreshtoken', {path: '/user/refresh_token'})
            return res.json({msg: "Logged out"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
}
const getUser= async (req,res)=>{
      
    try{
          
        const user= await UserModel.User.findById(req.user.id);
        if(!user) return res.status(400).json({msg:"User not exist"});
        res.json({user});
    }catch(err){
       res.status(500).json({msg:err.message});
    }
}

const creteAccessToken= (user)=>{
    return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1d'})
}
const createReferenceToken=(user)=>{
    return jwt.sign(user,process.env.REFRESH_TOKEN_SECRET,{expiresIn:'7d'})
}
module.exports={register,refreshToken,login,logout,getUser}