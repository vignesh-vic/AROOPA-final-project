import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import Navbar from "./Navbar"; // Import the Navbar component
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { Button, Modal } from "antd";
import DeleteIcon from "@mui/icons-material/Delete";
import { ExclamationCircleFilled } from "@ant-design/icons";
import axios from "axios";
import moment from "moment"; // Import the moment library
import { useNavigate } from "react-router-dom";

const FormCrud = (props) => {

  const [openRadio, setOpenRadio] = useState(false);
  const [options, setOptions] = useState(["Select ", "Option 1"]);
  const navigate = useNavigate();

  //button state
  const [selectedInputs, setSelectedInputs] = useState([]);
  //radio state
  const [radioInputs, setRadioInputs] = useState([]);
  //text input state
  const [textInputs, setTextInputs] = useState([]);
  //checkbox
  const [checkboxInputs, setCheckboxInputs] = useState([]);

  //button state
  const [buttonInputs, setButtonInputs] = useState([]);
  const [label, setLabel] = useState("");
  const [editButtonIndex, setEditButtonIndex] = useState(null);
  const [buttonModalVisible, setButtonModalVisible] = useState(false);
  const [buttonName, setButtonName] = useState("");

  //store inputs
  const [formName, setFormName] = useState(""); //
  const { confirm } = Modal;
  const showDeleteConfirm = (data) => {
    confirm({
      title: "Are you sure delete this task?",
      icon: <ExclamationCircleFilled />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        handleDelete(data._id);
      },
      onCancel() {},
    });
  };
  const [modal1Open, setModal1Open] = useState(false);
  const [selectedRadio, setSelectedRadio] = useState("");
  const [passingId, setPassingId] = useState(0);

  //edit model
  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    setOpen(false);
    // Reset the form data state
    setFormData([]);

    // Reset the input values state
    setEditForms({});
  };
  const handleCancel = () => {
    setOpen(false);
  };
  //edit model 2
  const [openEdit, setOpenEdit] = useState(false);
  const showModalEdit = () => {
    setOpenEdit(true);
  };
  const handleOkEdit = () => {
    setOpenEdit(false);
  };
  const handleCancelEdit = () => {
    setOpenEdit(false);
  };

  const [rowData, setRowData] = useState([]);
  const [editForms, setEditForms] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/getUser", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        const rowData =
          data?.data?.map((x) => ({
            ...x,
            submissionsCount: x?.Submissons?.length || 0,
          })) || [];
        setRowData(rowData);

        // Extract formData from each item and concatenate into a single array
        const allFormData = rowData.reduce((acc, item) => {
          return acc.concat(item.formData || []);
        }, []);

        // Set allFormData into the editForms state
        setEditForms(allFormData);
   
      
      } catch (error) {
        console.error("Error fetching form data:", error.message);
      }
    };
    fetchData();
  }, [token]);

  const [formData, setFormData] = useState([]);

  const handleView = (data) => {
    setModal1Open(true);
    const { formData } = data;
    setFormData(() => {
      return formData;
    });
  };
  const handleButtonClick = (data) => {
    navigate("/SubmittedViews", { state: { data: data } });
  };
  // const handleButtonClick=(data)=>{
  //   navigate("/SubmittedViews", { state: { _id: data._id } });

  // }
  const handleEdit = (data) => {
    showModal();
    const { formData } = data;
    setFormData(() => {
      return formData;
    });
    setSelectedRadio(formData[0]?.name || ""); // Assuming radio buttons have a 'name' property
  };
  const formatCreatedAt = ({ value }) => {
    return moment(value).format("MMM Do YYYY, h:mm: a");
  };
  const columDefination = [
    { field: "formName" },
    {
      field: "createdAt",
      headerName: "Created At",
      valueFormatter: formatCreatedAt,
    },
    { field: "createdBy" },
    {
      field: "submissionsCount",
      headerName: "Submissions",
      cellRenderer: ({ data }) => {
        if (data?.submissionsCount) return data?.submissionsCount;
        return "0";
      },
    },
    {
      field: "ListOfAction",
      width: "50px",
      cellRenderer: ({ data }) => {
        return (
          <>
            <span
              onClick={() => {
                handleEdit(data);
                setPassingId(data._id);
              }}
              style={{ cursor: "pointer" }}
            >
              {<RemoveRedEyeIcon className="text-blue-900" />}
            </span>
            {/* <span
              style={{ cursor: "pointer" }}
              onClick={() => {
                showModalEdit();
              }}
            >
              <ModeEditIcon className="text-blue-900 ml-5" />
            </span> */}
            <span
              onClick={() => showDeleteConfirm(data)}
              style={{ cursor: "pointer" }}
            >
              <DeleteIcon className="text-red-500 ml-2" />
            </span>
          </>
        );
      },
    },
    {
      field: "Submission views",
      cellRenderer: ({ data }) => {
        return (
          <>
            <button
             style={{
               padding: "5px 10px",
               borderRadius: "3px",
               cursor: "pointer",
               marginRight: "180px",
             }}
              onClick={() => {
                handleButtonClick(data);
              }}
              className="bg-cyan-300 p-1 rounded-md ml-2 pb-4"
            >
              Submission views{" "}
            </button>
          </>
        );
      },
    },
  ];
  //delete model
  const handleDelete = async (_id) => {
    axios
      .delete(`http://localhost:5000/formdelete/${_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.message) {
          alert(res.data.message);
        }
        setRowData((prev) => prev.filter((item) => item._id !== _id));
      })
      .catch((err) => console.log(err));
  };

  const defaultCol = {
    sortable: true,
    editable: true,
    filter: true,
    resizable: true,
    flex: 1,
  };
  const handleSubmit = async () => {
    const filledInputs = editForms.filter((input) => input.value !== "");
    const submittedPayload = {
      Submitted: filledInputs,
    };
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `http://localhost:5000/Submitted${passingId}`,
        {
          Submitted: submittedPayload.Submitted,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle the response from the backend if needed
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle the error, show a message, etc.
    }
  };

  const handleReset = () => {
    // Reset all input values in inputValues
    setEditForms([...editForms]);
  };
  // Add Select Element
  const handleAddSelect = () => {
    setSelectedInputs((prev) => [
      ...prev,
      { type: "select", options: options },
    ]);
  };
  const handleAddRadio = () => {
    const newRadioInput = {
      type: "radio",
      options: ["Option 1", "Option 2"],
      name: "New Radio", // Set a default name or modify as needed
      value: "",
    };
    setRadioInputs((prev) => [...prev, newRadioInput]);
    setSelectedRadio(newRadioInput.name);
    setOpenRadio(false); // Close the radio modal
  };

  const handleAddCheckbox = () => {
    const newCheckboxInput = {
      type: "checkbox",
      label: "",
    };
    setCheckboxInputs((prev) => [...prev, newCheckboxInput]);
  };
  const handleAddButton = () => {
    const newButtonInput = {
      type: "button",
      name: "Button Name",
    };
    setButtonInputs((prev) => [...prev, newButtonInput]);
    setOpenRadio(false); // Close the radio modal
  };
  const handleDeleteType = (index, type) => {
    switch (type) {
      case "text":
        setTextInputs((prev) => prev.filter((_, i) => i !== index));
        break;
      case "select":
        setSelectedInputs((prev) => prev.filter((_, i) => i !== index));
        break;
      case "radio":
        setRadioInputs((prev) => prev.filter((_, i) => i !== index));
        break;
      case "checkbox":
        setCheckboxInputs((prev) => prev.filter((_, i) => i !== index));
        break;
      case "button":
        setButtonInputs((prev) => prev.filter((_, i) => i !== index));
        break;
      default:
        break;
    }
  };
  return (
    <div>
      <Navbar
    
      />
      <Modal
        title="Preview"
        style={{
          top: 20,
        }}
        open={modal1Open}
        onOk={() => {
          setModal1Open(false);
        }}
        onCancel={() => setModal1Open(false)}
      >
        {formData && formData.length > 0
          ? formData.map((data, index) => (
              <div key={index}>
                <label>{data.label}</label>
                <div>
                  {data.type === "text" && (
                    <input
                      className="mt-1 p-2 border border-gray-300 mb-3 rounded w-full"
                      placeholder={data.placeholder}
                      type="text"
                    />
                  )}

                  {data.type === "select" && (
                    <select
                      className="mt-1 p-2 border mb-5 border-gray-300 rounded w-full"
                      placeholder={data.placeholder}
                    >
                      {data.options &&
                        data.options.map((option, optionIndex) => (
                          <option key={optionIndex} value={option.value}>
                            {option}
                          </option>
                        ))}
                    </select>
                  )}

                  {data.type === "radio" && (
                    <div key={index}>
                      <label>{data.name}</label>
                      <input type={data.type} className="mb-4" />
                    </div>
                  )}

                  {data.type === "checkbox" && (
                    <div key={index}>
                      <label>{data.name}</label>
                      <input
                        type={data.type}
                        value={data.value}
                        className="mb-5"
                      />
                    </div>
                  )}

                  {data.type === "button" && (
                    <div key={index}>
                      <button
                        type={data.type}
                        className="bg-blue-500 mb-4 text-white py-2 px-4 rounded"
                      >
                        {data.name}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          : "no data"}
      </Modal>

      <Modal
        open={open}
        title="Submit"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="reset" onClick={handleReset}>
            Reset
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              handleSubmit();
              setOpen(false);
            }}
          >
            Submit
          </Button>,
        ]}
      >
        {formData && formData.length > 0
          ? formData.map((data, index) => (
              <div key={index}>
                <label>{data.label}</label>
                <div>
                  {data.type === "text" && (
                    <input
                      className="mt-1 p-2 border border-gray-300 mb-3 rounded w-full"
                      placeholder={data.placeholder}
                      type="text"
                      onChange={(e) => {
                        setEditForms((preData) => {
                          const updatedData = [...preData];
                          updatedData[index].value = e.target.value;
                          return updatedData;
                        });
                      }}
                    />
                  )}

                  {data.type === "select" && (
                    <select
                      className="mt-1 p-2 border mb-5 border-gray-300 rounded w-full"
                      placeholder={data.placeholder}
                      onChange={(e) => {
                        setEditForms((preData) => {
                          const updatedData = [...preData];
                          updatedData[index].value = e.target.value;
                          return updatedData;
                        });
                      }}
                    >
                      {data.options &&
                        data.options.map((option, optionIndex) => (
                          <option key={optionIndex} value={option}>
                            {option}
                          </option>
                        ))}
                    </select>
                  )}

                  {data.type === "radio" && (
                    <div key={index}>
                      <label>{data.name}</label>
                      <input
                        type={data.type}
                        className="mb-4"
                        onChange={(e) => {
                          setSelectedRadio(data.name);
                          setEditForms((preData) => {
                            const updatedData = [...preData];
                            updatedData[index].value = e.target.value;
                            return updatedData;
                          });
                        }}
                        checked={selectedRadio === data.name}
                        value={data.name}
                      />
                    </div>
                  )}

                  {data.type === "checkbox" && (
                    <div key={index}>
                      <label>{data.name}</label>
                      <input
                        type={data.type}
                        value={data.name}
                        className="mb-5"
                        onChange={(e) => {
                          setEditForms((preData) => {
                            const updateData = [...preData];
                            updateData[index].value = e.target.value;
                            return updateData;
                          });
                        }}
                      />
                    </div>
                  )}

                  {data.type === "button" && (
                    <div key={index}>
                      <button
                        type={data.type}
                        className="bg-blue-500 mb-4 text-white py-2 px-4 rounded"
                        onChange={(e) => {
                          setEditForms((preData) => {
                            const updatedData = [...preData];
                            updatedData[index].value = e.target.value;
                            return updatedData;
                          });
                        }}
                        value={data.name}
                      >
                        {data.name}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          : "no data"}
      </Modal>
      {/* <Modal
        open={openEdit}
        title="Submit"
        onOk={handleOkEdit}
        onCancel={handleCancelEdit}
        footer={[
          <Button key="back" onClick={handleCancelEdit}>
            Cancel
          </Button>,
          <Button key="reset" onClick={handleReset}>
            Reset
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              handleSubmit();
              setOpenEdit(false);
            }}
          >
            Submit
          </Button>,
        ]}
      >
        <div className="mb-2">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded"
            onClick={() => setTextInputs((prev) => [...prev, { type: "text" }])}
          >
            Add Text
          </button>
        </div>
        <div className="mb-2">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded"
            onClick={handleAddSelect}
          >
            Add Select
          </button>
        </div>
        <div className="mb-2">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded"
            onClick={handleAddRadio}
          >
            Add Radio
          </button>
        </div>
        <div className="mb-2">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded"
            onClick={handleAddCheckbox}
          >
            Add CheckBox
          </button>
        </div>
        <div className="mb-2">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded"
            onClick={handleAddButton}
          >
            Add button
          </button>
        </div>
        {formData && formData.length > 0
          ? formData.map((data, index) => (
              <div key={index}>
                <label>{data.label}</label>
                <div>
                  {data.type === "text" && (
                    <input
                      className="mt-1 p-2 border border-gray-300 mb-3 rounded w-full"
                      placeholder={data.placeholder}
                      type="text"
                    />
                  )}
                  <button
                    className="bg-red-500 ml-2 text-white py-2 px-4 rounded"
                    onClick={() => handleDeleteType(index, "checkbox")}
                  >
                    Delete
                  </button>

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

                  {data.type === "radio" && (
                    <div key={index}>
                      <label>{data.name}</label>
                      <input
                        type={data.type}
                        className="mb-4"
                        onChange={(e) => {
                          setSelectedRadio(data.name);
                        }}
                        checked={selectedRadio === data.name}
                        value={data.name}
                      />
                    </div>
                  )}

                  {data.type === "checkbox" && (
                    <div key={index}>
                      <label>{data.name}</label>
                      <input
                        type={data.type}
                        value={data.name}
                        className="mb-5"
                      />
                    </div>
                  )}

                  {data.type === "button" && (
                    <div key={index}>
                      <button
                        type={data.type}
                        className="bg-blue-500 mb-4 text-white py-2 px-4 rounded"
                        value={data.name}
                      >
                        {data.name}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          : "no data"}
      </Modal> */}

      <div
        className="mt-11 ml-2 bg-slate-200  p-1 pl-2  h-9 rounded-sm"
        role="presentation"
      >
        <Breadcrumbs aria-label="breadcrumb">
          <Typography className="font-bold" color="text.primary">
            FormCrud
          </Typography>
        </Breadcrumbs>
      </div>

      <Link to="/form">
        <button
          className="ml-4 mt-9"
          style={{
            backgroundColor: "blue",
            color: "white",
            padding: "5px 10px",
            borderRadius: "3px",
            cursor: "pointer",
            marginRight: "180px",
          }}
        >
          Create NewForm
        </button>
      </Link>
      <div
        className="w-[100%] mt-6 p-4 overflow-auto"
        style={{ maxHeight: "600px" }} // Set your desired height here
      >
        <div className=" ag-theme-alpine " style={{ height: 800 }}>
          <AgGridReact
            rowData={[...rowData]}
            columnDefs={columDefination}
            defaultColDef={defaultCol}
          />
        </div>
      </div>
    </div>
  );
};
export default FormCrud;
