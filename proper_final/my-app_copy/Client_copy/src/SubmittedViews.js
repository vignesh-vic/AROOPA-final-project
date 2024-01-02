import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import Navbar from "./Navbar";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { useLocation } from "react-router-dom";
import { Button, Modal } from "antd";
import axios from "axios";

function SubmittedViews(props) {
  const [submitView, setSubmitView] = useState([]);
  const [selectedValues, setSelectedValues] = useState(null);
  const location = useLocation();
  const yourData = location?.state?.data;
  const [open, setOpen] = useState(false);
  const token = localStorage.getItem("token");

  const showModal = (data) => {
    setSelectedValues(data);
    setOpen(true);
  };
  const handleOk = () => {
    setOpen(false);
  };
  const handleCancel = () => {
    setOpen(false);
  };

  // const { _id } = location.state || {};
  // setSubmitView(_id.Submissons)
  console.log("yourPropValue", submitView);
  const columDefination = [
    { field: "SubmittedBy" },
    { field: "SubmittedTime" },
    {
      headerName: "Submissions values",
      field: "values",
      cellRenderer: ({ data }) => {
        return (
          <>
            <button
              className="bg-blue-400 text-center pl-2 pr-2 w-16 rounded-md"
              onClick={() => showModal(data.values)}
            >
              View
            </button>
          </>
        );
      },
    },
  ];
  useEffect(() => {
    // Fetch data from the backend using the props.id
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/Submitted/${yourData._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data;
        // console.log("dta",data.Submissons)
        if (data && data) {
          setSubmitView(...Object.values(data));
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
        // Handle error fetching data from the backend
      }
    };

    fetchData(); // Call the fetchData function
  }, [yourData._id, token]);
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    if (e.target.innerText === "MYFORM") {
      navigate("/formcrud");
    }
  };
  return (
    <div>
      <Navbar />
      <div
        className="mt-5 ml-2 bg-slate-200  p-1 pl-2  h-9 rounded-sm"
        role="presentation"
        onClick={handleClick}
      >
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            className="font-bold"
            underline="hover"
            color="inherit"
            href="/material-ui/getting-started/installation/"
          >
            MYFORM
          </Link>
        </Breadcrumbs>
      </div>
      <Modal
        open={open}
        title="Submisson views"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Ok
          </Button>,
        ]}
      >
        {selectedValues &&
          Object.values(selectedValues).map((data, index) => (
            <div key={index}>
              <label>{data?.label}</label>

              <div>
                {data?.type === "text" && (
                  <input
                    className="mt-1 p-2 border border-gray-300 mb-3 rounded w-full"
                    placeholder={data.placeholder}
                    type="text"
                    value={data.value}
                  />
                )}
                {data?.type === "select" && (
                  <select
                    className="mt-1 p-2 border mb-5 border-gray-300 rounded w-full"
                    placeholder={data.placeholder}
                  >
                    <option>{data?.value}</option>
                  </select>
                )}
              </div>
            </div>
          ))}
        {/* {
          selectedValues && selectedValues.length>0 ? selectedValues.values.map((data,index)=>(
              <div key={index}>
                  <label>{data.value}</label>
                <div>
                <div>
                  {data.type === "text" && (
                    <input
                      className="mt-1 p-2 border border-gray-300 mb-3 rounded w-full"
                      placeholder={data.placeholder}
                      type="text"
                      value={data.value}
                    />
                  )}
                   {data.type === "select" && (
                    <select
                      className="mt-1 p-2 border mb-5 border-gray-300 rounded w-full"
                      placeholder={data.placeholder}
                 
                    >
                      {data.options &&
                        data.options.map((option, optionIndex) => (
                          <option key={optionIndex} value={option}>
                            {option}
                          </option>
                        ))}
                    </select>
                  )}

                  </div>
                </div>
              </div>
          ))
          :("no data")
        } */}
      </Modal>
      <div className="w-[50%] mt-6 p-4 ">
        <div className=" ag-theme-alpine " style={{ height: 800 }}>
          <AgGridReact rowData={submitView} columnDefs={columDefination} />
        </div>
      </div>
    </div>
  );
}

export default SubmittedViews;
