
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();



// Create User
const createProjectPart = async (req, res) => {
  console.log(req.body)
 
    const { project_part_name,projectId,project_part_desc } = req.body;
    

    const user = await prisma.ProjectPart.create({
      data: {
        projectPartName:" Backend Header",
        projectPartDdesc: "Create a interactive header part",
        
        projectId:1,
        
        frontStatus:"1", 
        backStatus:"1",
        deletedAt: new Date(),
       
        
        
      },
    });
  
    res.json(user);


 
};

const getProjectPart =async (req,res)=>{
  try {
    const project = await prisma.ProjectPart.findMany({
     select:{
      project_part_name: true,
      project_part_desc: true,
      Project:{
        select:{
          project_name: true,
          category:{
            select:{
              category_name: true
            }
          }
        }
      }
     }
      
    });
    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching products.' });
  }
}


module.exports = {
    createProjectPart,
    getProjectPart

 
};
