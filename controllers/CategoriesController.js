const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();  //{log:['query']}



// Create User
const createcategory = async (req, res) => {
  
  try{
    const { category_name } = req.body;
    console.log(req.body)

    const category = await prisma.projectCategory.create({
      data: {
        category_name,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  
    res.json(category);

  }catch(err){
    res.status(404);
    
  }
 
};




module.exports = {
  createcategory,

 
};
