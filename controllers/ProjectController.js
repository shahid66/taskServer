
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();



// Create User
const createProject = async (req, res) => {
  console.log(req.body)
  try{
    const { projectName,documents,startDate,endDate,status,thumbnail } = req.body;
    

    const user = await prisma.project.create({
      data: {
        
        categoryId:1,
        projectName ,
        documents, 
        startDate, 
        endDate, 
        status, 
        thumbnail
        // createdAt: new Date(),
        // updatedAt: new Date(), 
  
        
      },
    });
  
    res.json(user);

  }catch(err){
    res.status(404);
    
  }
 
};

const getProject =async (req,res)=>{
  try {
    const project = await prisma.project.findMany({
     
      include:{
        category:{select:{id:true, category_name:true}}
      }
      
    });
    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching products.' });
  }
}




module.exports = {
  createProject,
  getProject

 
};
