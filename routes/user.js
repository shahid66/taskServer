const express =require('express');

const { protect } = require('../middleware/AuthMiddleware');
const { test, createUser, getUser, login, updateUser } = require('../controllers/UserController');
const { upload } = require('../helpers/fileUpload');

const router=express.Router()

router.get('/',test)
router.post('/login',login)
router.get('/user',protect,getUser)
router.put('/user',upload.single("image"),protect,updateUser)
router.post('/register',upload.single('image'), createUser)


module.exports=router;