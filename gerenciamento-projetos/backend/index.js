const express = require("express");
const mongoose = require("mongoose");
const Project = require("./models/project.model.js");
const projectRoute = require("./routes/project.route.js");
const authRoute = require("./routes/user.route.js");
//import mongoose from 'mongoose';

//Middleware
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes
app.use("/api/projects", projectRoute);
app.use("/api/auth", authRoute);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.get("/", (req, res) => {
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
