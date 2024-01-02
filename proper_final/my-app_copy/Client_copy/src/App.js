import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import UserCrud from "./UserCrud";
import UserForm from "./UserForm";
import FormCrud from "./FormCrud";
import Navbar from "./Navbar";
import SubmittedViews from "./SubmittedViews";
const App = () => {
  const [loginState, setLoginState] = useState(false);
  // const [selected, setSelected] = useState({});
  const [tokenKey, setTokenKey] = useState(localStorage.getItem("token"));
  const [id, setId] = useState();
 

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Login
              setTokenKey={setTokenKey}
              setLoginState={setLoginState}
              // selected={selected}
              // setSelected={setSelected}
              setId={setId}
            />
          }
        />
        {tokenKey ? (
          <Route
            path="/user"
            element={
              <UserCrud
                id={id}
                setLoginState={setLoginState}
                // selected={selected}
                token={tokenKey}
                // setSelected={setSelected}
              />
            }
          />
        ) : (
          <Route path="/user" element={<Navigate to="/" />} />
        )}
        <Route
          path="/formcrud"
          element={<FormCrud 
            // selected={selected} setSelected={setSelected} 
            />}
        />
        <Route path="/form" element={<UserForm 
        // selected={selected}
         />} />

        <Route path="/Signup" token={tokenKey} element={<Signup />} />
  
        <Route path="/Navbar" element={<Navbar
        //  selected={selected} 
         />} />
        <Route path="/submittedviews" element={<SubmittedViews
        //  selected={selected} 
         />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
