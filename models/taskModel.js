import mongoose from "mongoose";

const { Schema } = mongoose;

const taskSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
  },
  priority: {
    type: Number,
    default: 1,
  },
  status: {
    type: String,
    default: "Pending",
  },
  start_time: {
    type: Date, // Use Date type for proper date handling
    default: () => new Date(), // Default to the current date and time
  },
  end_time: {
    type: Date, // Use Date type for proper date handling
    default: () => {
      const now = new Date();
      now.setHours(now.getHours() + 1); // Default to 1 hour from now
      return now;
    },
  },
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
