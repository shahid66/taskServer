const express = require("express");

const { upload } = require("../helpers/fileUpload");
const { createTask, allTask, deleteTask, statusChangeTask, taskSearchByStatus, taskSearchByMonth, taskSearchByToday } = require("../controllers/taskController");
const { protect } = require("../middleware/AuthMiddleware");

const router = express.Router();

router.post('/task',protect,createTask)
router.get('/taskStatus/:status',protect,taskSearchByStatus)
router.get('/taskSearchByMonth/:month',protect,taskSearchByMonth)
router.get('/taskSearchByToday/:day',protect,taskSearchByToday)
router.get('/task',protect,allTask)
router.delete('/task/:id',protect,deleteTask)
router.put('/task/:id',protect,statusChangeTask)


module.exports = router;