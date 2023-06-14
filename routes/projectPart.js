const express =require('express');

const {  createProjectPart,getProjectPart } = require('../controllers/ProjectPartController');


const router=express.Router()





router.post('/createProjectPart', createProjectPart)
router.get('/getProjectPart', getProjectPart)






module.exports=router;