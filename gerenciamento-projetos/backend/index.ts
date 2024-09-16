import express, { Request, Response } from "express";
import mongoose from "mongoose";
import projectRoute from "./routes/project.route";
import authRoute from "./routes/user.route";
import cors from "cors";
import cookieParser from "cookie-parser";


//Middleware
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));

//routes
app.use("/api/projects", projectRoute);
app.use("/api/auth", authRoute);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Node API test");
});

mongoose
  .connect(
    "mongodb+srv://matheus935:D2mhXmwdqaKmONX5@bootcampdb.u1ha4.mongodb.net/?retryWrites=true&w=majority&appName=bootcampDB"
  )
  .then(() => {
    console.log("Conected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });
