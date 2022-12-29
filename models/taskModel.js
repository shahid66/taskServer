const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const taskSchema = mongoose.Schema(
  {
    user: {
      type: ObjectId,
      required: true,
      ref: "User",
    },
    task: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
    },
    taskpriority: {
      type: String,
      emun: ["Low","Medium","Heigh"],
      default:"Low",
      trim: true,
    },
    taskstatus: {
      type: Boolean,
      default:false,
      
    },
    date: {
      type: String,
      required: true,
      default:"00/00/0000",
      
      trim: true,
    },
    day: {
      type: String,
      required: [true, "Please add a valid date"],
      default:"00",
      
      trim: true,
    },
    month: {
      type: String,
      required: [true, "Please add a valid date"],
      default:"00",
      
      trim: true,
    },
    year: {
      type: String,
      required: true, 
      default:"2000",
      
      trim: true,
    },
 
  
    description: {
      type: String,
      required: [true, "Please add a description"],
      trim: true,
    },
    
  },
  { timestamps: true,versionKey: false }
);

const TaskModel = mongoose.model("task", taskSchema);
module.exports = TaskModel;