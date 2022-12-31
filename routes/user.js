const express =require('express');

const { protect } = require('../middleware/AuthMiddleware');
const {  createUser, getUser, login, updateUser, recovary, recovaryOTP, createPassword, } = require('../controllers/UserController');
const { upload } = require('../helpers/fileUpload');

const router=express.Router()


router.post('/login',login)
router.get('/user',protect,getUser)
router.put('/user',upload.single("image"),protect,updateUser)
router.post('/register', createUser)
router.get('/emailRecovery/:email', recovary)
router.get('/verifyOTP/:email/:OTP', recovaryOTP)
router.post('/passwordUpdate', createPassword)





module.exports=router;