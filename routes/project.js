const express =require('express');

const {  createProject,getProject } = require('../controllers/ProjectController');


const router=express.Router()





router.post('/createProject', createProject)
router.get('/getProject', getProject)






module.exports=router;