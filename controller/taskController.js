import User from "./../models/userModel.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import Task from "../models/taskModel.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(404).json({ message: "All Fields are required" });
    }

    const alreadyExits = await User.findOne({ email: email });
    if (alreadyExits) {
      return res.status(404).json({ message: "User Already Exits" });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const token = crypto.randomBytes(32).toString("hex");

    const user = new User({
      email: email,
      password: hashedPass,
      token: token,
    });

    await user.save().catch((err) => {
      throw new Error("Database Save Failed");
    });

    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addTask = async (req, res) => {
  const { token, title, priority, start_time, end_time } = req.body;
  try {
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const newTask = new Task({
      userId: user._id,
      title: title,
      priority: priority,
      start_time: start_time,
      end_time: end_time,
    });

    const savedTask = await newTask.save();

    return res
      .status(200)
      .json({ message: "Task Created Successfully", task: savedTask });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateTask = async (req, res) => {
  const { task_id, ...newData } = req.body;
  console.log(task_id, newData); // Debugging to make sure the correct data is received

  try {
    const task = await Task.findOne({ _id: task_id });
    if (!task) {
      return res.status(404).json({ message: "Task does not exist" });
    }

    // Update task fields with new data
    Object.assign(task, newData);

    // Save the updated task
    const updatedTask = await task.save();

    return res
      .status(200)
      .json({ message: "Task Updated Successfully", updatedTask });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteTask = async (req, res) => {
  const { task_id } = req.body;
  try {
    const task = await Task.findOne({ _id: task_id });
    if (!task) {
      return res.status(404).json({ message: "Task Is Not Exits" });
    }
    await task.deleteOne({ _id: task_id });
    await task.save();
    return res.status(200).send({ message: "Task Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllTaskBasedOnUser = async (req, res) => {
  const { token } = req.query;
  try {
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    const allTasks = await Task.find({ userId: user._id });
    return res.json({ allTasks });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
