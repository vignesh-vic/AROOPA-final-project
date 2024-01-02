const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv=require('dotenv')
const mongoose = require("mongoose");
const path=require('path')
app.use(bodyParser.json({ type: "application/json" }));
app.use(bodyParser.urlencoded({ extended: true }));

// Body parser middleware
app.use(bodyParser.json({ type: "application/json" }));
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;
dotenv.config();


mongoose
  .connect("mongodb+srv://vignesh:vignesh123@cluster0.9cqtctj.mongodb.net/sample")
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));

//user crud
const cors = require("cors");

app.use(cors());
const userRoutes = require("../Server/routes/route"); 
//Routes
app.use("/", userRoutes);


app.listen(PORT, () => {
  console.log(`server Listening http://localhost:${PORT}`);
});

//100-message
//200-sucess
//300-redirect
//400-client side error
//500-sever side error