const express =require('express');

const {   createcategory, } = require('../controllers/CategoriesController');


const router=express.Router()





router.post('/createCategory', createcategory)






module.exports=router;