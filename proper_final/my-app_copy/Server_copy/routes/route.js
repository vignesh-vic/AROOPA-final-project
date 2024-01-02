const router = require("express").Router();
const bodyParser = require("body-parser");
const express=require("express")
const app = express();
const jwt = require("jsonwebtoken");
require("dotenv").config();

app.use(bodyParser.json({ type: "application/json" }));
app.use(bodyParser.urlencoded({ extended: true }));

// Body parser middleware
app.use(bodyParser.json({ type: "application/json" }));
app.use(bodyParser.urlencoded({ extended: true }));
const {
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
  } = require('../controllers/controller');

//middleware
const verifyTokenKey = require("../middleware/middleware"); 

// Routes

//user Routes
router.get("/get", verifyTokenKey, getUser);
router.get("/getToken", verifyTokenKey, getToken);
router.post("/post", handlePostRequest);
router.put("/put", verifyTokenKey, putUser);
router.patch("/my/:Id", verifyTokenKey, updateUser);
router.delete("/delete/:Id", verifyTokenKey, deleteUser);

//Login routes
router.get("/login", loginUser);
router.post("/login", postLogin);

//form routes
router.get("/getUser", verifyTokenKey, getUserData);
router.post("/updateNames", verifyTokenKey, updateForm);
router.post("/Submitted:passingId", verifyTokenKey, postSubmission);
router.get("/Submitted/:id", verifyTokenKey, getSubmissions);
router.delete("/formdelete/:_id", verifyTokenKey, deleteForm);

module.exports=router 