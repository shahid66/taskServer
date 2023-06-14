
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();



// Create User
const createUser = async (req, res) => {
  
  try{
    const { name, email, password } = req.body;
    console.log(req.body)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password
      },
    });
  
    res.json({accessToken:"Helloworld",user});

  }catch(err){
    res.status(404);
    
  }
 
};

const loginUser = async (req, res) => {
  
  try{
    const {  email, password } = req.body;
    
    const UserLogin = await prisma.user.findFirst({
      where:{email:email, password:password},
      
    })

  console.log(UserLogin)
    res.json({accessToken:"Helloworld",user:UserLogin});

  }catch(err){
    res.status(404);
    
  }
 
};



module.exports = {
  createUser,
  loginUser

 
};
