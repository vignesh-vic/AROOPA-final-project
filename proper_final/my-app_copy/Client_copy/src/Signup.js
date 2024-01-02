import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";

const Signup = (props) => {
  const navigate = useNavigate();
  const [changeButtonMode, setchangeButtonMode] = useState(0);
  const [inputValues, setInputValues] = useState({
    Id: "",
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    password: "",
    confirmPassword: "",
    role: "",
    age: "",
    Active: "",
  });

  const handleSave = () => {
    if (
      !inputValues.firstName ||
      !inputValues.lastName ||
      !inputValues.email ||
      !inputValues.gender ||
      isNaN(inputValues.age) || // Check if age is a valid number
      inputValues.Active === null // Check if Active is a valid boolean
    ) {
      alert("Please enter valid data for all fields.");
      return;
    }
    // const token = localStorage.getItem("token");
    axios.post("http://localhost:5000/post", {
      firstName: inputValues.firstName,
      lastName: inputValues.lastName,
      gender: inputValues.gender,
      email: inputValues.email,
      password: inputValues.password,
      role: inputValues.role,
      age: inputValues.age,
    });
    navigate("/");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <div className="flex justify-center items-center">
        
        <div className=" rounded-xl  p-[70px]">
          <div className="text-center text-2xl mb-3">Create User</div>
          <div
            className=" "
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "300px",
              margin: "0 auto",
            }}
          >
            <TextField
              name="firstName"
              value={inputValues.firstName}
              onChange={handleChange}
              placeholder="firstName"
              margin="normal"
              required
              fullWidth
              id="firstName"
              label="firstName"
              autoComplete="firstName"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="lastName"
              label="lastName"
              autoComplete="lastName"
              autoFocus
              value={inputValues.lastName}
              name="lastName"
              onChange={handleChange}
              placeholder="lastName"
            />
            <FormControl component="fieldset">
              <label>Gender:</label>
              <RadioGroup
                row
                aria-label="gender"
                name="gender"
                value={inputValues.gender}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="male"
                  control={<Radio />}
                  label="Male"
                />
                <FormControlLabel
                  value="female"
                  control={<Radio />}
                  label="Female"
                />
              </RadioGroup>
            </FormControl>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              autoComplete="email"
              autoFocus
              value={inputValues.email}
              onChange={handleChange}
              name="email"
              placeholder="email"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="Password"
              label="Password"
              autoComplete="Password"
              autoFocus
              type="password"
              value={inputValues.password}
              onChange={handleChange}
              name="password"
              placeholder="Password"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="confirmPassword"
              label="confirmPassword"
              autoComplete="email"
              autoFocus
              type="password"
              value={inputValues.confirmPassword}
              onChange={handleChange}
              name="confirmPassword"
              placeholder="Confirm Password"
            />
         <FormControl fullWidth>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                value={inputValues.role}
                label="Role"
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>
                <MenuItem value="Manager">Manager</MenuItem>
                <MenuItem value="SuperAdmin">SuperAdmin</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Owner">Owner</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="normal"
              required
              fullWidth
              id="number"
              label="Age"
              autoComplete="Age"
              autoFocus
              type="number"
              value={inputValues.age}
              onChange={handleChange}
              placeholder="age"
              name="age"
            />
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={
                !inputValues.firstName ||
                !inputValues.lastName ||
                !inputValues.email ||
                !inputValues.gender ||
                isNaN(inputValues.age)
              }
              style={{
                backgroundColor:
                  !inputValues.firstName ||
                  !inputValues.lastName ||
                  !inputValues.email ||
                  !inputValues.gender ||
                  isNaN(inputValues.age)
                    ? "#ccc" // Light gray when disabled
                    : "blue", // Blue when enabled
                color: "white",
              }}
              onClick={
                changeButtonMode === 0
                  ? () => {
                      handleSave();
                    }
                  : () => {
                      setchangeButtonMode(0);
                      setInputValues({
                        firstName: "",
                        lastName: "",
                        email: "",
                        gender: "",
                        age: "",
                        role: "",
                        password: "",
                        confirmPassword: "",
                      });
                    }
              }
            >
              {changeButtonMode === 0 ? "Signup" : "UPDATE"}
            </Button>
            <div className="bg-blue-700 w-[100%] text-center text-white p-2 rounded-lg mt-4">
              <Link className="pt-5" to="/">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
