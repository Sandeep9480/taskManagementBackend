import { Router } from "express";
import {
  addTask,
  deleteTask,
  getAllTaskBasedOnUser,
  login,
  updateTask,
} from "../controller/taskController.js";

const router = new Router();

router.route("/login").post(login);
router.route("/add_task").post(addTask);
router.route("/update_task").post(updateTask);
router.route("/delete_task").delete(deleteTask);
router.route("/get_all_tasks").get(getAllTaskBasedOnUser);

export default router;
