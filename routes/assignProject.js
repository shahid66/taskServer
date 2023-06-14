const express =require('express');
const { assignProject, getAssignedProjectByUserId } = require('../controllers/AssignProjectController');




const router=express.Router()





router.post('/assignProject', assignProject)
router.get('/getAssignedProjectByUserId', getAssignedProjectByUserId)






module.exports=router;