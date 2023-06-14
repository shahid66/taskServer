const express =require('express');

const { protect } = require('../middleware/AuthMiddleware');
const {  createUser, loginUser, } = require('../controllers/UserController');
const { upload } = require('../helpers/fileUpload');

const router=express.Router()





router.post('/register', createUser)
router.post('/loginUser', loginUser)






module.exports=router;