const express=require('express');
const { createTask, deleteTask, updateStatus, selectByStatus, taskStatusCount, searchByKey } = require('../controllers/TaskController');
const { getTestData } = require('../controllers/testController');
const { registration, login, profileUpdate, getProfile, recoveryEmail, RecoveryVerifyOTP, CreatePassword } = require('../controllers/UserController');
const AuthVerifyMiddleware=require('../middlewares/AuthVerifyMiddleware')
const router=express.Router()
router.get('/',getTestData)

router.post('/register',registration)
router.post('/login',login)
router.post('/profileUpdate',AuthVerifyMiddleware,profileUpdate)
router.get('/getProfile',AuthVerifyMiddleware,getProfile)

router.post('/createTask',AuthVerifyMiddleware,createTask)
router.get('/deleteTask/:id',AuthVerifyMiddleware,deleteTask)
router.get('/updateStatus/:id/:status',AuthVerifyMiddleware,updateStatus)
router.get('/selectByStatus/:status',AuthVerifyMiddleware,selectByStatus)
router.get('/taskStatusCount',AuthVerifyMiddleware,taskStatusCount)



router.get('/recoveryEmail/:email',recoveryEmail)
router.get('/verifyOTP/:email/:OTP',RecoveryVerifyOTP)

router.post('/passwordUpdate',CreatePassword)

router.get('/search/:status/:searchKey',AuthVerifyMiddleware,searchByKey)


module.exports=router;