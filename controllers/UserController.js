const asyncHandler = require("express-async-handler");
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const { fileSizeFormatter } = require("../helpers/fileUpload");
const cloudinary = require("../helpers/Cloudinary");
const fs = require('fs')
const { promisify } = require('util');
const path = require("path");
const UserModel = require("../models/UserModel");

const unlinkAsync = promisify(fs.unlink)

// date formate

const date=new Date();  
const day=date.getDate();
const month=date.getMonth();
const year=date.getFullYear();


const generateToken=(id)=>{
  return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"1d"})
  }
// Create User
const createUser = asyncHandler(async (req, res) => {
  try{
    const { name, email,password } = req.body;
    
   //   Validation
   if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }
  const user = await UserModel.create({
    name, email,password, 
    
  });
  const token=generateToken(user._id)
  if(user){ 
    const {_id,name,email,image,phone}=user
    res
    .status(200)
    .json({ status: "success", token: token, data:{_id,name,email,image,phone} });
  }else{
    
    res.status(404);
    throw new Error("User not create");
  }
  }catch(err){
    res.status(404);
    throw new Error("User already exists");
  }
 
});


// Update User
const updateUser = asyncHandler(async (req, res) => {
  let userId = req.headers["user"];
 
  
  const user = await UserModel.findById(userId);


    // Handle Image upload
    let fileData = {};
    if (req.file) {
      
      filePath = path.join( 'uploads',user.image.fileName);
      const IsFile=fs.existsSync(filePath)
     if(IsFile){
      unlinkAsync(filePath)
     }


      
      fileData = {
        fileName:`${day+"-"+month+"-"+year + "-" + req.file.originalname}`,
        fileLocalPath:`${req.protocol}://${req.headers.host}/${day+"-"+month+"-"+year + "-" + req.file.originalname}`,
        fileType: req.file.mimetype,
        fileSize: fileSizeFormatter(req.file.size, 2),
      };
    }




if(user){

  if(req.body.password.length>2){
    if(req.file){
      user.name = req.body.name 
      user.password = req.body.password;
      user.image=fileData;
      const updatedUser = await user.save();
      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        
      });
     }else{
      user.name = req.body.name 
      user.password = req.body.password;
      const updatedUser = await user.save();
      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        
      });
    }
  }else{
     if(req.file){
       user.name = req.body.name 
     user.image=fileData;
     const updatedUser = await user.save();
     res.status(200).json({
       _id: updatedUser._id,
       name: updatedUser.name,
       
     });
   }else{
       user.name = req.body.name    
       const updatedUser = await user.save();
       res.status(200).json({
         _id: updatedUser._id,
         name: updatedUser.name,
         
       });
     }
   }

}else {
  res.status(404);
  throw new Error("User not found");
}
  
});
const getUser = asyncHandler(async (req, res) => {
  let userId = req.headers["user"];
  const userData=await UserModel.findById(userId)

  if(userData){
      const {_id,name,email,image,phone}=userData
      res.status(200).json({
          _id,name,email,image,phone
      })
  }else{
      res.status(400)
      throw new Error ("User not Found")
  }

 
});

const login=asyncHandler(async (req,res)=>{
 
  const {email,password}=req.body

  if(!email|| !password){
      res.status(400)
      throw new Error ("Please add email and password")
  }

  const user = await UserModel.findOne({email})

  if(!user){
      res.status(400)
      throw new Error ("User not found") 
  }
  const passwordIsCorrrect= await bcrypt.compare(password,user.password)

  const token=generateToken(user._id)

  if(user && passwordIsCorrrect){
      const {_id,name,email,image,phone}=user
        
        res
          .status(200)
          .json({ status: "success", token: token, data:{_id,name,email,image,phone} });
  }else{
      res.status(400)
      throw new Error ("Invalid Email or Password") 
  }
})
const test = asyncHandler(async (req, res) => {

  res.status(201).json({message:"hoise"});
});







module.exports = {
  createUser,
  getUser,
  login,
  updateUser,

  test
 
};
