const jwt=require('jsonwebtoken')
module.exports=(req,res,next)=>{
let token=req.headers.token;
jwt.verify(token,"secretKeyshahid",(err,decode)=>{
    if(err){
        res.status(401).json({status:"unauthorized"})
    }else{
        let email=decode['data'];
        req.headers.email=email
        next();
    }
})
}