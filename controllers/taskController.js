const asyncHandler = require("express-async-handler");

const { fileSizeFormatter } = require("../helpers/fileUpload");
const cloudinary = require("../helpers/Cloudinary");
const fs = require('fs')
const { promisify } = require('util');
const path = require("path");
const TaskModel = require("../models/taskModel");

const unlinkAsync = promisify(fs.unlink)

// date formate

const date=new Date();  
const day=date.getDate();
const month=date.getMonth();
const year=date.getFullYear();

// Create Prouct
const createTask = asyncHandler(async (req, res) => {
  

  const { task, taskpriority, date,description } = req.body;
let stringDate=date.toString()
let splitDate=stringDate.split("T")
let ca=splitDate[0]
let cd=ca.split('-')
let chaiDate=cd[2]+'/'+cd[1]+'/'+cd[0]
console.log(chaiDate)
  //   Validation
  if (!task || !taskpriority || !date || !description ) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }else{

    
  // Create Product
  const taskCreate = await TaskModel.create({
    user:req.headers.user,
    task,
    taskpriority,date:chaiDate,description,
    day:cd[2],
    month:cd[1],
    year:cd[0]
  });

  res.status(201).json(taskCreate);
}});
const allTask = asyncHandler(async (req, res) => {
  

  // Create Product
  const task = await TaskModel.find({user:req.headers.user});

  res.status(201).json(task);
});
const taskSearchByStatus = asyncHandler(async (req, res) => {

if(req.params.status){
const task = await TaskModel.find({$and:[{user:req.headers.user},{taskstatus:req.params.status}]});

  res.status(201).json(task);
}
  // Create Product

});
const taskSearchByToday = asyncHandler(async (req, res) => {
  let day
  if(req.params.day==1){
    day="01"
  }else if(req.params.day==2){
    day="02"
  }
  else if(req.params.day==3){
    day="03"
  }
  else if(req.params.day==4){
    day="04"
  }
  else if(req.params.day==5){
    day="05"
  }
  else if(req.params.day==6){
    day="06"
  }
  else if(req.params.day==7){
    day="07"
  }
  else if(req.params.day==8){
    day="08"
  }
  else if(req.params.day==9){
    day="09"
  }else{
    day=req.params.day
  }
 
const task = await TaskModel.find({$and:[{user:req.headers.user},{day:day}]});
 
  res.status(201).json(task);


});
const taskSearchByMonth = asyncHandler(async (req, res) => {
  let month
  if(req.params.month==1){
    month="01"
  }else if(req.params.month==2){
    month="02"
  }
  else if(req.params.month==3){
    month="03"
  }
  else if(req.params.month==4){
    month="04"
  }
  else if(req.params.month==5){
    month="05"
  }
  else if(req.params.month==6){
    month="06"
  }
  else if(req.params.month==7){
    month="07"
  }
  else if(req.params.month==8){
    month="08"
  }
  else if(req.params.month==9){
    month="09"
  }else{
    month=req.params.month
  }
  

// const task = await TaskModel.find({$and:[{user:req.headers.user},{date:d}]});
const task = await TaskModel.find({$and:[{user:req.headers.user},{month:month}]});
console.log(task)
  res.status(201).json(task);


});
const deleteTask = asyncHandler(async (req, res) => {
  let tId=req.params.id;
  let uId=req.headers.user
  let object=uId.toString()
 

  const task = await TaskModel.deleteOne({$and:[{_id:tId},{user:object}]});

  res.status(201).json(task);
});
const statusChangeTask = asyncHandler(async (req, res) => {
  let tId=req.params.id;
  let uId=req.headers.user
  let object=uId.toString()
  let bodyData=req.body

  

  
  const task = await TaskModel.updateOne({$and:[{_id:tId},{user:object}]},{
    taskstatus:bodyData.status
  });
  

  res.status(201).json(task);
});



module.exports = {
  createTask,
  allTask,
  deleteTask,
  statusChangeTask,
  taskSearchByStatus,
  taskSearchByMonth,
  taskSearchByToday
 
};
