import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import taskRoutes from "./routes/taskRoute.js";

dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(taskRoutes);

const main = async () => {
  await mongoose.connect(process.env.MONGO_URL);
};

main()
  .then(() => {
    console.log("Database Connected");
  })
  .catch((error) => {
    console.log("Something Went Wrong", error);
  });

app.listen(PORT, () => {
  console.log(`Server is runnning at port ${PORT}`);
});
