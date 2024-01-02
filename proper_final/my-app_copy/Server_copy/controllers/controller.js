const moment = require("moment");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const mongoose = require("mongoose");
// const { ObjectId } = require("mongoose").Types;
const { userModel, formModel } = require("../models/userSchema"); // Import user and form models

//GET for usercrud
const getUser = async (_, res) => {
    try {
      const data = await userModel.find();
      res.status(200).send({ message: "Get method run sucessfully", data: data });
    } catch (error) {
        console.log("ER",error);
      res.status(500).send({ message: "server side error" });
    }
  };
  

  const getToken = async (req, res) => {
    try {
      res
        .status(200)
        .send({ message: "Get method run sucessfully", data: req.user });
    } catch (error) {
      res.status(500).send({ message: "server side error" });
    }
  };
  
  //post for usercrud
  const handlePostRequest = async (req, res) => {
    try {
      const {
        _id,
        firstName,
        lastName,
        email,
        gender,
        password,
        confirmPassword,
        role,
        age,
      } = req.body || {};
      // Validate that the received data has the required properties
  
      //hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedpassword = await bcrypt.hash(password, salt);
  
      if (!firstName || !lastName || !email || !gender || !age)
        return res.status(400).json({ message: "Required field missing" });
      const userData = new userModel({
        firstName,
        lastName,
        email,
        gender,
        password: hashedpassword,
        confirmPassword,
        role,
        age,
      });
  
      await userData.save();
      return res.status(200).send({ message: "Data inserted successfully" });
    } catch (error) {
      return res.status(500).send({ message: "server side error" });
    }
  };
  
  // PUT for usercrud
  const putUser = async (req, res) => {
    try {
      const { updatedNames = [] } = req.body;
      if (!Array.isArray(updatedNames) || updatedNames.length === 0) {
        return res.status(400).send({ message: "An array of names is required" });
      }
      // Replace the contents of storedb with the new array
      storedb = [...updatedNames];
      return res.status(200).send({ message: "Array updated successfully" });
    } catch (error) {
      return res.status(500).send({ message: "Server-side error" });
    }
  };


  //usercrud
const updateUser = async (req, res) => {
    try {
      const { Id = "" } = req.params || {};
  
      if (!Id || !mongoose.isValidObjectId(Id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      const {
        firstName,
        lastName,
        gender,
        email,
        password,
        confirmPassword,
        role,
        age,
      } = req.body || {};
      if (!firstName || !lastName || !email || !gender || !age)
        return res.status(400).json({ message: "Required field missing" });
  
      const userData = await userModel.findById(Id);
      if (!userData) return res.status(400).json({ message: "invaild id" });
  
      userData.firstName = firstName;
      userData.lastName = lastName;
      userData.gender = gender;
      userData.email = email;
      userData.password = password;
      userData.confirmPassword = confirmPassword;
      userData.role = role;
      userData.age = age;
  
      await userData.save();
      return res.status(200).send({ message: "data updated successfully" });
    } catch (error) {
      console.log("error", error);
      return res.status(500).send({ message: "Server-side error" });
    }
  };
  //usercrud delete
  const deleteUser = async (req, res) => {
    try {
      const { Id = "" } = req.params || {};
      if (!Id) return res.status(400).json({ message: "Required field missing" });
  
      await userModel.findByIdAndDelete(Id);
      return res.status(200).send({ message: "Row Deleted successfully" });
    } catch (error) {
      return res.status(500).send({ message: "Server-side error" });
    }
  };
  //login get
  const loginUser = async (_, res) => {
    res.json({ message: "log request received successfully in", data: data });
  };
  
  //login post call
  const postLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .send({ message: "Username and password are required" });
      }
      const user = await userModel.findOne({ email }).lean();
      if (!user)
        return res
          .status(400)
          .send({ message: "user name or password is invalid" });
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch)
        return res.status(400).send({ message: "Invalid username or password" });
  
      const token = jwt.sign({ ...user }, `${process.env.JWT_SECRET}`);
      return res.status(200).send({
        message: "Login successful",
        userList: user,
        token: token,
      });
    } catch (error) {
        console.log("err",error);
      return res.status(400).send({ message: "error at login" });
    }
  };
    
//-----------------------form

  
//form get call
const getUserData = async (_, res) => {
    try {
      const data = await formModel.find();
      res.json({
        message: "GET request received successfully",
        data: data,
      });
    } catch (error) {
      console.error("Error fetching form data:", error.message);
      res.status(500).json({ message: "Server Error" });
    }
  };
  
  //form post call
  const updateForm = async (req, res) => {
    try {
      const { name, form } = req.body;
      const { firstName } = req.user;
  
      const newForm = new formModel({
        formName: name,
        formData: form,
        createdBy: firstName,
      });
      await newForm.save();
      return res.status(200).send({
        message: "Form data updated and stored in MongoDB successfully",
      });
    } catch (error) {
      console.error("Error:", error.message);
      return res.status(500).send({ message: "Server-side error" });
    }
  };
  const postSubmission = async (req, res) => {
    try {
      const { Submitted } = req.body;
      const { passingId } = req.params || {}; // Assuming you pass the formId in the request
      const { firstName } = req.user; // Assuming the username is stored in the token
      const existingForm = await formModel.findById(passingId);
      
      const flatObject = Object.values(Submitted).map((a) => a);
      if (!existingForm) {
        return res.status(404).send({ message: "id not found" });
      }
      const submittedTime = moment().format("MMM Do YYYY, h:mm:a");
      existingForm.Submissons.push({
        SubmittedBy: firstName,
        SubmittedTime: submittedTime,
        values: { ...flatObject },
      });
      await existingForm.save();
    } catch (error) {
      console.error("Error:", error.message);
      return res.status(500).send({ message: "Server-side error" });
    }
  };
  
  const getSubmissions = async (req, res) => {
    try {
      const { id } = req.params || {};
      const existingForm = await formModel.findById(id);
  
      if (!existingForm) {
        return res.status(404).send({ message: "Form not found" });
      }
  
      // Assuming you want to send the Submissions array
      const submissions = existingForm.Submissons || [];
      res.status(200).json({ submissions });
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).send({ message: "Server-side error" });
    }
  };
  
  //form delete call
  const deleteForm = async (req, res) => {
    try {
      const { _id = "" } = req.params || {};
      if (!_id)
        return res.status(400).json({ message: "Required field missing" });
      await formModel.findByIdAndDelete(_id);
      return res.status(200).send({ message: "Row Deleted successfully" });
    } catch (error) {
      return res.status(500).send({ message: "Server-side error" });
    }
  };

  module.exports = {
    getUser,
    getToken,
    handlePostRequest,
    putUser,
    updateUser,
    deleteUser,
    loginUser,
    postLogin,
    getUserData,
    updateForm,
    postSubmission,
    getSubmissions,
    deleteForm,
  };