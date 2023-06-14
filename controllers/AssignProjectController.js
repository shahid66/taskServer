const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({log:['query']});  //{log:['query']}



// Create User
const assignProject = async (req, res) => {
  

    const { category_name } = req.body;
    console.log(req.body)

    const category = await prisma.projectAssign.create({
      data: {
        startdate : new Date(),
        endDate : new Date(),
        status: false,
        deletedAt : new Date(),
        
        userId:1,
        projectId:1,
        projectPartId:2
        
      },
    });
  
    res.json(category);

  
 
};

// Create User
const getAssignedProjectByUserId = async (req, res) => {
  
  
    const { category_name } = req.body;
    console.log(req.body)

    const category = await prisma.projectAssign.findMany({
        include:{
            project:true,
            user:true,
            projectPart:true
        }
      
    //   include:{
        
    //     Project:true
    //     // user:{select:{name:true,email:true}},
    //     // Project:{select:{project_name:true}},
    //     // ProjectPart:true
    //   }
    });
  
    res.json(category);


 
};




module.exports = {
    assignProject,
    getAssignedProjectByUserId

 
};
