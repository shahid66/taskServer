const asyncHandler = require("express-async-handler");
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const { fileSizeFormatter } = require("../helpers/fileUpload");
const cloudinary = require("../helpers/Cloudinary");
const fs = require('fs')
const { promisify } = require('util');
const path = require("path");
const UserModel = require("../models/UserModel");
const OTPModel = require("../models/OTPModel");
const EmailUtility = require("../helpers/NodeMailer");

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
      
      // if(user.image.fileName!=="default.png"){
      //   const IsFile=fs.existsSync(filePath)
      //   if(IsFile){
      //    unlinkAsync(filePath)
      //   }
      // }
     


      
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
const recovary = asyncHandler(async (req, res) => {
  let email = req.params.email;
  let minm = 100000;
  let maxm = 999999;
  let OTPCode = Math.floor(Math.random() * (maxm - minm + 1)) + minm;
  
  try {
    //Email Query
    let UserCount = await UserModel.aggregate([
      { $match: { email: email } },
      { $count: "total" },
    ]);

    if (UserCount[0].total > 0) {
      
      //OTP insert
      let CreateOTP = await OTPModel.create({ email: email, otp: OTPCode });
      
      //Email send
      let SendMail = await EmailUtility(
        email,
        "Your PIN Code= " + OTPCode,
        "Task Manager PIN Verification"
      );

      res.status(200).json({ status: "success", data: SendMail,email });
    } else {
      res.status(404).json({ status: "fail", data: "No User Found" });
    }
  } catch (e) {
    res.status(404).json({ status: "fail", data: e });
  }
});
const recovaryOTP = asyncHandler(async (req, res) => {
  let email = req.params.email;
  let OTP = req.params.OTP;
  let status=0;
  let UpdateStatus=1;
  

  try {
    //Email Query
    let CountOTP = await OTPModel.aggregate([{$match:{email:email, otp: OTP,status:status  }},{$count:'total'}]);

    if (CountOTP[0].total >  0) {
      //OTP Update
     let UpdateOTPStatus= await OTPModel.updateOne({email:email, otp: OTP,status:status},{email:email, otp: OTP,status:UpdateStatus})
     

      res.status(200).json({ status: "success", data: UpdateOTPStatus });
    } else {
      res.status(404).json({ status: "fail", data: "Invalid OTP" });
    }
  } catch (e) {
    res.status(404).json({ status: "failr", data: e });
  }
});
const createPassword = asyncHandler(async (req, res) => {
  
  let email = req.body.email;
  let OTPCode=req.body.otp
  let password = req.body.password;
  let UpdateStatus=1;
  

  try {
    //Email Query
    let CountOTP = await OTPModel.aggregate([{$match:{email:email, otp: OTPCode,status:UpdateStatus  }},{$count:'total'}]);

    if (CountOTP[0].total >  0) {
      //OTP Update
      
     let UpdatePassword= await UserModel.findOne({email:email,})
     if(UpdatePassword){
      UpdatePassword.password=password
      UpdatePassword.save()
      res.status(200).json({ status: "success", data: UpdatePassword });
     }else{
      res.status(200).json({ status: "fail", data: "Invalid OTP" });
     }
     

      
    } else {
      res.status(200).json({ status: "fail", data: "Invalid OTP" });
    }
  } catch (e) {
    res.status(200).json({ status: "failr", data: e });
  }
});







module.exports = {
  createUser,
  getUser,
  login,
  updateUser,
  createPassword,
  recovary,
  recovaryOTP
 
};
