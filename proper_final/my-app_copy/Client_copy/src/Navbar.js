import React, { useState, useEffect } from "react";
import axios from "axios";

import { NavLink } from "react-router-dom";
import { AppBar, Box, Container, Toolbar } from "@mui/material";
// import { Modal, Button } from "antd";
const Navbar = (props) => {
  const [selected, setSelected] = useState();

  useEffect(() => {
    // Fetch data from the backend using the props.id
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/getToken`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = response.data;
        // console.log("dta",data.Submissons)
          if (data && data) {
          setSelected(data.data);
       }
        

      } catch (error) {
        console.error("Error fetching data:", error.message);
        // Handle error fetching data from the backend
      }
    };

    fetchData(); // Call the fetchData function
  }, []); 
  
  const handleLogout = () => {

    // Remove the "token" item from localStorage
    localStorage.removeItem('token');
    // Additional logic for logging out, redirecting, or updating state
    // ...
  };
  return (
    <>
      <AppBar position="static">
        <Container>
          <Toolbar className="flex justify-between text-white">
            <Box className="flex items-center mr-24 text-white">
              <span className="text-white pr-5 ">{selected?selected.firstName:''}</span>
              <span className="text-white pr-5 ">{selected?selected?.role:''}</span>
              <NavLink
                className="text-white hover:opacity-70  active:bg-blue-700 p-5 rounded-sm"
                to="/formcrud"
                // onClick={localStorage.removeItem('token')}
              >
                CreateForm
              </NavLink>|
              <NavLink
                className="text-white hover:opacity-70  active:bg-blue-700 p-5 rounded-sm"
                to="/user"
                // onClick={localStorage.removeItem('token')}
              >
            CreateUser
              </NavLink>
            </Box>
            <Box>
              <NavLink
                className="text-white hover:opacity-70  active:bg-blue-700 p-5 rounded-sm"
                to="/"
                // onClick={localStorage.removeItem('token')}
                onClick={handleLogout}

              >
                Logout
              </NavLink>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};

export default Navbar;
