const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    gender: { type: String },
    email: { type: String },
    password: { type: String },
    confirmPassword: { type: String },
    role: { type: String },
    age: { type: Number },
  });
  
  //user crud model
  const userModel = mongoose.model("user", userSchema);
  
  const formSchema = new mongoose.Schema({
    formName: { type: String },
    formData: { type: Array },
    createdBy: { type: String },
    createdAt: { type: Date, default: Date.now },
    Submissons: { type: Array },
  });
  //form model
  const formModel = mongoose.model("form", formSchema);

  
  module.exports = { formModel, userModel };
