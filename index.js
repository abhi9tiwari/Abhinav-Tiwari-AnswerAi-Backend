require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const authRouter = require("./routers/authRouter");
const questionRouter = require("./routers/questionRouter");

//initialising imported instances
const app = express();
app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
//so that express can access encoded urls
app.use(express.urlencoded({ extended: true }));

//connection made with mongoDb atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB");
  });

//Router embedded in index.js
app.use("/api", authRouter());
app.use("/api",questionRouter());

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});



