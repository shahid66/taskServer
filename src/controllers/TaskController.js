const TaskModel = require("../models/TaskModel");
exports.createTask = (req, res) => {
    
  let reqBody = req.body;
  reqBody.email=req.headers['email']
  TaskModel.create(reqBody, (err, data) => {
    if (err) {
      res.status(400).json({ status: "fail", data: err });
    } else {
      res.status(200).json({ status: "success", data: data });
    }
  });
};
exports.deleteTask = (req, res) => {
  let id=req.params.id
  console.log(id)
  TaskModel.deleteOne({_id:id}, (err, data) => {
    if (err) {
      res.status(400).json({ status: "fail", data: err });
    } else {
      res.status(200).json({ status: "success", data: data });
    }
  });
};
exports.updateStatus = (req, res) => {
  let id=req.params.id;
  let status=req.params.status;
  console.log(status)
  TaskModel.updateOne({_id:id},{status:status}, (err, data) => {
    if (err) {
      res.status(400).json({ status: "fail", data: err });
    } else {
      res.status(200).json({ status: "success", data: data });
    }
  });
};

exports.selectByStatus=(req,res)=>{
  let email=req.headers['email'];
  let status=req.params.status;
  
  TaskModel.aggregate([{$match:{email:email,status:status}},{$project:{_id:1,title:1,description:1,status:1,createdDate:{
    $dateToString:{
      date:"$createdDate",
      format:"%d,%m,%Y"
    }
  }}}],(err,data)=>{
      if(err){
        res.status(400).json({ status: "fail", data: err });
      }else{
        res.status(200).json({status:"success",data:data})
      }
  })
  
  }

  exports.taskStatusCount=(req,res)=>{
    let email=req.headers['email'];
   
    
    TaskModel.aggregate([{$match:{email:email}},{$group:{_id:"$status",sum:{$count:{}}}},{ $sort: { _id: -1 } }],(err,data)=>{
        if(err){
          res.status(400).json({status:"fail",data:err})
        }else{
          res.status(200).json({status:"success",data:data})
        }
    })
    
    }

    exports.searchByKey=(req,res)=>{
      let email=req.headers['email'];
      let searchKey=req.params.searchKey;
      let status=req.params.status;
      let SearchRgx={"$regex":searchKey,"$options":"i"}
      let SearchQuery={$or:[{title:SearchRgx}]}
      
      TaskModel.aggregate([{$match:{email:email,title:SearchRgx,status:status}}],(err,data)=>{
          if(err){
            res.status(400).json({ status: "fail", data: err });
          }else{
            res.status(200).json({status:"success",data:data})
          }
      })
      
      }
  
