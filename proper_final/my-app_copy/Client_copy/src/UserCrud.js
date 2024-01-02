import React, { useState, useEffect } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import Navbar from "./Navbar"; // Import the Navbar component
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import { Button, Modal } from "antd";
import TextField from "@mui/material/TextField";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { Link } from "react-router-dom";

// import Item from "antd/es/list/Item";
export default function UserCrud(props) {
  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    setOpen(false);
  };
  const handleCancel = () => {
    setOpen(false);
  };
  const [openUser, setOpenUser] = useState(false);

  const showModalUser = () => {
    setOpenUser(true);
  };
  const handleOkUser = () => {
    setOpenUser(false);
  };
  const handleCancelUser = () => {
    setOpenUser(false);
  };

  const [role, setRole] = useState(false);
  const [selected, setSelected] = useState();

  //userCrud
  const [changeButtonModeUser, setchangeButtonModeUser] = useState(0);
  const [inputValuesUser, setInputValuesUser] = useState({
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
  const handleSaveUser = () => {
    if (
      !inputValuesUser.firstName ||
      !inputValuesUser.lastName ||
      !inputValuesUser.email ||
      !inputValuesUser.gender ||
      isNaN(inputValuesUser.age) || // Check if age is a valid number
      inputValuesUser.Active === null // Check if Active is a valid boolean
    ) {
      alert("Please enter valid data for all fields.");
      return;
    }
    // const token = localStorage.getItem("token");
    axios.post("http://localhost:5000/post", {
      firstName: inputValuesUser.firstName,
      lastName: inputValuesUser.lastName,
      gender: inputValuesUser.gender,
      email: inputValuesUser.email,
      password: inputValuesUser.password,
      role: inputValuesUser.role,
      age: inputValuesUser.age,
    });
  };

  const handleChangeUser = (e) => {
    const { name, value } = e.target;
    setInputValuesUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  useEffect(() => {
    // Fetch data from the backend using the props.id
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/getToken`, {
          headers: {
            Authorization: `Bearer ${props.token}`,
          },
        });
        const data = response.data;
          if (data && data) {
          setSelected(data.data);
          if(selected?.role==="SuperAdmin" || selected?.role==="Owner"){setRole(false)}
          else{
            setRole(true)
          }
        }
        
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData(); // Call the fetchData function
  }, [props.token]);

  const [changeButtonMode, setchangeButtonMode] = useState(1);
  //store id in the state to find id to replace to update values
  const [passingId, setPassingId] = useState(0);

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


  const [userDetails, setUserDetails] = useState([]);
  // const role =selected? !(
  //   selected.role === "Owner" || selected.role === "SuperAdmin"
  // ):true

  //find the max id in the table
  const generateUniqueID = () => {
    const maxID = userDetails.reduce(
      (max, user) => (user.Id > max ? user.Id : max),
      0
    );
    return maxID + 1;
  };

  const [columDefination] = useState([
    { field: "firstName" },
    { field: "lastName" },
    { field: "gender" },
    { field: "email" },
    { field: "role", headerName: "Role" },
    { field: "age" },
    {
      field: "Action",
      cellRenderer: ({ data }) => {
        return (
          <button
            onClick={() => {
              showModal();
              showDatas(data);
              setPassingId(data._id);
            }}
            style={{
              backgroundColor: "blue",
              border: "none",
              color: "white",
              padding: "5px",
              cursor: "pointer",
            }}
          >
            Edit
          </button>
        );
      },
      hide: role,
    },
    {
      field: "Action",
      cellRenderer: ({ data }) => {
        return (
          <button
            style={{
              backgroundColor: "red",
              color: "white",
              padding: "4px 10px ",
              borderRadius: "3px",
              cursor: "pointer",
            }}
            onClick={() => {
              onHandleDelete(data._id); // Pass _id to onHandleDelete
            }}
          >
            Delete
          </button>
        );
      },
      hide: role,
    },
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //edit button show datas
  const showDatas = (resiveObj) => {
    setchangeButtonMode(1);
    setInputValues({
      firstName: resiveObj?.firstName,
      lastName: resiveObj?.lastName,
      gender: resiveObj.gender,
      email: resiveObj?.email,
      password: resiveObj?.password,
      confirmPassword: resiveObj?.confirmPassword,
      role: resiveObj?.role,
      age: resiveObj?.age,
    });

    setPassingId(resiveObj?.Id);
  };

  const newUserList = userDetails?.filter(
    (items) => items._id !== selected._id
  );

  const onHandleEdit = (_id) => {
    if (
      !inputValues.firstName||
      !inputValues.lastName ||
      !inputValues.email ||
      !inputValues.gender ||
      isNaN(inputValues.age)
    ) {
      alert("Please enter valid data for all fields.");
      return;
    }

    // Create an object with the fields you want to update
    const updatedFields = {
      firstName: inputValues?.firstName,
      lastName: inputValues?.lastName,
      gender: inputValues?.gender,
      email: inputValues?.email,
      password:inputValues?.password,
      confirmPassword: inputValues?.confirmPassword,
      role: inputValues?.role,
      age: Number(inputValues.age),
    };

    // Send a PATCH request to update specific fields
    axios
      .patch(`http://localhost:5000/my/${_id}`, updatedFields, {
        headers: {
          Authorization: `Bearer ${props.token}`,
        },
      })
      .then((res) => {
        if (res.data.message) {
          alert(res.data.message);
        }
      });

    // Update the user details in the frontend state
    setUserDetails((prev) => {
      return prev.map((user) => {
        if (user._id === _id) {
          return {
            ...updatedFields,
            _id,
          };
        }
        return user;
      });
    });

    // Reset input fields and exit editing mode
    setInputValues({
      firstName: "",
      lastName: "",
      email: "",
      gender: "",
      age: "",
      password: "",
      confirmPassword: "",
      role: "",
    });
  };

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

    axios
      .post("http://localhost:5000/post", {
        firstName: inputValues.firstName,
        lastName: inputValues.lastName,
        gender: inputValues.gender,
        email: inputValues.email,
        password: inputValues.password,
        confirmPassword: inputValues.confirmPassword,
        role: inputValues.role,
        age: inputValues.age,
      })
      .then((res) => {
        setUserDetails((prev) => {
          const newId = generateUniqueID();
          const arr = [...prev];
          arr.push({
            Id: newId,
            firstName: inputValues.firstName,
            lastName: inputValues.lastName,
            gender: inputValues.gender,
            email: inputValues.email,
            password: inputValues.password,
            confirmPassword: inputValues.confirmPassword,
            role: inputValues.role,
            age: Number(inputValues).age,
            // Active: inputValues.Active,
          });
          return arr;
        });
        setInputValues({
          firstName: "",
          lastName: "",
          email: "",
          gender: "",
          age: "",
          password: "",
          confirmPassword: "",
          role: "",
        });
        if (res.data.message) {
          alert(res.data.message);
        }
      });
  };

  //defauldcoldefs
  const defaultCol = {
    sortable: true,
    editable: true,
    filter: true,
    resizable: true,
    flex: 1,
  };

  const onHandleDelete = (_id) => {
    axios
      .delete(`http://localhost:5000/delete/${_id}`, {
        headers: {
          Authorization: `Bearer ${props.token}`,
        },
      })
      .then((res) => {
        if (res.data.message) {
          alert(res.data.message);
        }
        // Remove the deleted item from the local state
        setUserDetails((prev) => {
          return prev.filter((user) => user._id !== _id);
        });
      })
      .catch((err) => console.log(err));
    setInputValues({
      firstName: "",
      lastName: "",
      email: "",
      Password: "",
      confirmPassword: "",
      gender: "",
      age: "",
      role: "",
    });
  };
  useEffect(() => {
    axios
      .get("http://localhost:5000/get", {
        headers: {
          Authorization: `Bearer ${props.token}`,
        },
      })
      .then((res) => {
        const { data = [] } = res?.data || {};
        if (data && data?.length) {
          setUserDetails(data);
        }
      })
      .catch((err) => console.log(err));
  }, [props.token]);
  //breadcrums

  const resetForm = () => {
    setInputValues({
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
    setchangeButtonMode(1);
    setPassingId(0);
  };
  
  return (
    <div>
      <Navbar
        role={selected?selected.role:''}
        firstName={selected?selected.firstName:""}
        setModalInputValues={setInputValues}
        showDatas={showDatas}
        seletion={selected}
        setPassingId={setPassingId}
      />
       <button
          className="ml-4 mt-9 bg-blue-600"
          style={{
            color: "white",
            padding: "5px 10px",
            borderRadius: "3px",
            cursor: "pointer",
            marginRight: "180px",
          }}
          onClick={() => {
            showModalUser();
          }}
        >
          Create NewUser
        </button>
      <Modal
        open={open}
        title="add user"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Return
          </Button>,
          <Button key="back" onClick={resetForm}>
            Reset
          </Button>,
          <Button key="submit" type="primary" 
          onClick={
            changeButtonMode === 0
              ? () => {
                  handleSave();
                }
              : () => {
                  setchangeButtonMode(0);
                  onHandleEdit(passingId);
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
          }>       
          {changeButtonMode === 0 ? "ADD" : "UPDATE"}

             </Button>,
    
        ]}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "300px",
            margin: "0 auto",
          }}
        >
          <input
            style={{
              margin: "5px",
              padding: "5px",
              width: "100%",
              borderRadius: "3px",
              border: "1px solid #ccc",
            }}
            name="firstName"
            value={inputValues.firstName}
            onChange={handleChange}
            placeholder="firstName"
          />
          <input
            style={{
              margin: "5px",
              padding: "5px",
              width: "100%",
              borderRadius: "3px",
              border: "1px solid #ccc",
            }}
            value={inputValues.lastName}
            name="lastName"
            onChange={handleChange}
            placeholder="lastName"
          />
          <div>
            <label>Gender:</label>
            <label>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={inputValues.gender === "male"}
                onChange={handleChange}
              />
              Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={inputValues.gender === "female"}
                onChange={handleChange}
              />
              Female
            </label>
          </div>

          <input
            style={{
              margin: "5px",
              padding: "5px",
              width: "100%",
              borderRadius: "3px",
              border: "1px solid #ccc",
            }}
            value={inputValues.email}
            onChange={handleChange}
            name="email"
            placeholder="email"
          />

          <select
            onChange={handleChange}
            name="role" // Set the name to "role"
            value={inputValues.role}
          >
            <option value="">Select</option>
            <option value="Manager">Manager</option>
            <option value="SuperAdmin">SuperAdmin</option>
            <option value="Admin">Admin</option>
            <option value="Owner">Owner</option>
          </select>
          <input
            style={{
              margin: "5px",
              padding: "5px",
              width: "100%",
              borderRadius: "3px",
              border: "1px solid #ccc",
            }}
            type="number"
            value={inputValues.age}
            onChange={handleChange}
            placeholder="age"
            name="age"
          />

         
        </div>
      </Modal>

      <div
        className="mt-11 ml-2 mr-2 bg-slate-200  p-1 pl-2  h-9 rounded-sm"
        role="presentation"
      >
        <Breadcrumbs aria-label="breadcrumb">
          <Typography className="font-bold" color="text.primary">
            UserCrud
          </Typography>
        </Breadcrumbs>
      </div>
      <Modal
        open={openUser}
        title="Title"
        onOk={handleOkUser}
        onCancel={handleCancelUser}
        footer={[
          <Button key="back" onClick={handleCancelUser}>
            Cancel
          </Button>,
          
     
        ]}
      >
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
              value={inputValuesUser.firstName}
              onChange={handleChangeUser}
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
              value={inputValuesUser.lastName}
              name="lastName"
              onChange={handleChangeUser}
              placeholder="lastName"
            />
            <FormControl component="fieldset">
              <label>Gender:</label>
              <RadioGroup
                row
                aria-label="gender"
                name="gender"
                value={inputValuesUser.gender}
                onChange={handleChangeUser}
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
              value={inputValuesUser.email}
              onChange={handleChangeUser}
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
              value={inputValuesUser.password}
              onChange={handleChangeUser}
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
              value={inputValuesUser.confirmPassword}
              onChange={handleChangeUser}
              name="confirmPassword"
              placeholder="Confirm Password"
            />
         <FormControl fullWidth>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                value={inputValuesUser.role}
                label="Role"
                onChange={handleChangeUser}
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
              value={inputValuesUser.age}
              onChange={handleChangeUser}
              placeholder="age"
              name="age"
            />
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={
                !inputValuesUser.firstName ||
                !inputValuesUser.lastName ||
                !inputValuesUser.email ||
                !inputValuesUser.gender ||
                isNaN(inputValuesUser.age)
              }
              style={{
                backgroundColor:
                  !inputValuesUser.firstName ||
                  !inputValuesUser.lastName ||
                  !inputValuesUser.email ||
                  !inputValuesUser.gender ||
                  isNaN(inputValuesUser.age)
                    ? "#ccc" // Light gray when disabled
                    : "blue", // Blue when enabled
                color: "white",
              }}
              onClick={
                changeButtonModeUser === 0
                  ? () => {
                      handleSaveUser();
                    }
                  : () => {
                      setchangeButtonModeUser(0);
                      setInputValuesUser({
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
              {changeButtonModeUser === 0 ? "Add User" : "UPDATE"}
            </Button>
         
          </div>
        
      </Modal>

      <div className=" w-[90%] p-4 ">
        <div className=" ag-theme-alpine" style={{ height: 900 }}>
          <AgGridReact
            rowData={newUserList}
            columnDefs={columDefination}
            defaultColDef={defaultCol} // Set onGridReady prop
          />
        </div>
      </div>
    </div>
  );
}
