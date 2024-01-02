import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { Button, Input, Modal } from "antd";
import axios from "axios";
import Navbar from "./Navbar";
const UserForm = (props) => {
  //radio model
  const [openRadio, setOpenRadio] = useState(false);
  const [options, setOptions] = useState(["Select ", "Option 1"]);
  const [selectModalVisible, setSelectModalVisible] = useState(false); // New state for select modal
  const [selectedSelectIndex, setSelectedSelectIndex] = useState(null); // Index of selected select input
  const [selectedRadioIndex, setSelectedRadioIndex] = useState(null);

  //button state
  const [selectedInputs, setSelectedInputs] = useState([]);
  //radio state
  const [radioInputs, setRadioInputs] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [open, setOpen] = useState(false);
  const [placeholder, setPlaceholder] = useState("");
  //text input state
  const [textInputs, setTextInputs] = useState([]);
  //checkbox
  const [checkboxInputs, setCheckboxInputs] = useState([]);
  const [selectedCheckboxIndex, setSelectedCheckboxIndex] = useState(null);
  const [checkboxModalVisible, setCheckboxModalVisible] = useState(false);
  const [checkboxLabel, setCheckboxLabel] = useState(""); //

  //button state
  const [buttonInputs, setButtonInputs] = useState([]);
  const [label, setLabel] = useState("");
  const [editButtonIndex, setEditButtonIndex] = useState(null);
  const [buttonModalVisible, setButtonModalVisible] = useState(false);
  const [buttonName, setButtonName] = useState("");

  //store inputs
  const [formName, setFormName] = useState(""); // State to store the form name

  const handleSubmitForm = async () => {
    const newOutput = [
      ...textInputs.map((input) => ({
        type: "text",
        label: input.label,
        placeholder: input.placeholder,
        value: "",
      })),
      ...selectedInputs.map((input) => ({
        type: "select",
        options: input.options,
        value: "",
      })),
      ...radioInputs.map((input) => ({
        type: "radio",
        name: input.label,
        value: "",
      })),
      ...checkboxInputs.map((input) => ({
        type: "checkbox",
        name: input.label,
        value: "",
      })),
      ...buttonInputs.map((input) => ({
        type: "button",
        name: input.name,
        value: input.name,
      })),
    ];

    // Create the payload
    const payload = {
      name: formName,
      form: newOutput,
    };

    const token = localStorage.getItem("token");
    //sent data to backend
    await axios
      .post(
        "http://localhost:5000/updateNames",
        {
          name: payload.name,
          form: payload.form,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

    // Clear the input states
    setTextInputs([]);
    setSelectedInputs([]);
    setRadioInputs([]);
    setCheckboxInputs([]);
    setButtonInputs([]);
    setFormName("");
  };
  //checkbox model
  const showCheckboxModal = (index) => {
    const inputToEdit = checkboxInputs[index];
    setCheckboxLabel(inputToEdit.label || "");
    setSelectedCheckboxIndex(index);
    setCheckboxModalVisible(true);
  };

  const handleCheckboxOk = () => {
    // Handle checkbox input update here
    const updatedInputs = checkboxInputs.map((input, index) =>
      index === selectedCheckboxIndex
        ? { ...input, label: checkboxLabel }
        : input
    );
    setCheckboxInputs(updatedInputs);
    setCheckboxLabel("");
    // Reset other properties if needed
    setCheckboxModalVisible(false);
    setSelectedCheckboxIndex(null); // Reset selected index
    setEditIndex(null);
  };

  const handleCheckboxCancel = () => {
    setCheckboxModalVisible(false);
  };

  const handleAddCheckbox = () => {
    const newCheckboxInput = {
      type: "checkbox",
      label: "",
    };
    setCheckboxInputs((prev) => [...prev, newCheckboxInput]);
  };
  // Add Select Element
  const showModalRadio = (index) => {
    setEditIndex(index); // Set the index of the radio input being edited
    setOpenRadio(true);
  };

  const handleOkRadio = () => {
    // Handle radio input update here
    const updatedRadioInputs = [...radioInputs];
    updatedRadioInputs[editIndex].label = label;
    setRadioInputs(updatedRadioInputs);

    setOpenRadio(false);
    setLabel("");
    setEditIndex(null);
  };

  const handleCancelRadio = () => {
    setOpenRadio(false);
    setLabel("");
    setEditIndex(null);
  };

  //button model
  const showButtonModal = (index) => {
    const buttonToEdit = buttonInputs[index];
    setButtonName(buttonToEdit ? buttonToEdit.label : ""); // Set button name for editing
    setEditButtonIndex(index);
    setButtonModalVisible(true);
  };

  const handleOkButton = () => {
    if (editButtonIndex !== null) {
      const updatedButtons = buttonInputs.map((button, index) =>
        index === editButtonIndex ? { ...button, name: buttonName } : button
      );
      setButtonInputs(updatedButtons);
    } else {
      const newButton = {
        type: "button",
        label: buttonName,
      };
      setButtonInputs((prev) => [...prev, newButton]);
    }

    setButtonName(""); // Reset button name
    setEditButtonIndex(null);
    setButtonModalVisible(false);
  };

  const handleCancelButton = () => {
    setLabel("");
    setEditButtonIndex(null);
    setButtonModalVisible(false);
  };
  const handleAddButton = () => {
    const newButtonInput = {
      type: "button",
      name: "Button Name",
    };
    setButtonInputs((prev) => [...prev, newButtonInput]);
    setOpenRadio(false); // Close the radio modal
  };

  //text model
  const showModal = (index) => {
    const inputToEdit = textInputs[index];
    setLabel(inputToEdit.label);
    setPlaceholder(inputToEdit.placeholder);
    setEditIndex(index);
    setOpen(true);
  };

  const handleOk = () => {
    if (editIndex !== null) {
      const updatedInputs = textInputs.map((input, index) =>
        index === editIndex ? { ...input, label, placeholder } : input
      );
      setTextInputs(updatedInputs);
    } else {
      const newInput = {
        type: "text",
        label,
        placeholder,
      };
      setTextInputs((prev) => [...prev, newInput]);
    }

    setLabel("");
    setPlaceholder("");
    setOpen(false);
    setEditIndex(null);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleAddRadio = () => {
    const newRadioInput = {
      type: "radio",
      options: ["Option 1", "Option 2"],
      value: "",
    };
    setRadioInputs((prev) => [...prev, newRadioInput]);
    setOpenRadio(false); // Close the radio modal
  };

  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    if (e.target.innerText === "MYFORM") {
      navigate("/formcrud");
    }
  };
  const handleDelete = (index, type) => {
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

  // Add Select Element
  const handleAddSelect = () => {
    setSelectedInputs((prev) => [
      ...prev,
      { type: "select", options: options },
    ]);
  };

  //dyna
  const handleRadioChange = (index) => {
    setSelectedRadioIndex(index);
    let selectedRadio = radioInputs[index].label;
    console.log("Selected Radio Value:", selectedRadio);
  };

  // Open select modal
  const showSelectModal = (index) => {
    const inputToEdit = selectedInputs[index];
    setLabel(inputToEdit.label || ""); // Ensure label is initialized
    setPlaceholder(inputToEdit.placeholder || ""); // Ensure placeholder is initialized
    setSelectedSelectIndex(index);
    setSelectModalVisible(true);
    setOptions(inputToEdit.options); // Set options for editing
  };
  const handleDeleteOption = (index) => {
    const updatedOptions = [...options];
    updatedOptions.splice(index, 1);
    setOptions(updatedOptions);
  };
  const handleAddOption = () => {
    setOptions((prev) => [...prev, "New Option"]);
  };

  const handleSelectOk = () => {
    // Handle select input update here
    const updatedInputs = selectedInputs.map((input, index) =>
      index === selectedSelectIndex
        ? { ...input, label, placeholder, options }
        : input
    );
    setSelectedInputs(updatedInputs);
    setLabel("");
    setPlaceholder("");
    setOptions(["Select", "Option 1"]); // Reset options
    setSelectModalVisible(false);
    setEditIndex(null);
  };

  const handleSelectCancel = () => {
    setSelectModalVisible(false);
  };

  return (
    <>
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
          <Typography className="font-bold" color="text.primary">
            Edit
          </Typography>
        </Breadcrumbs>
      </div>
      <div className="flex mt-52 ml-2 mr-2">
        <div className="p-4 w-[30%] border border-gray-300">
          <h2 className="text-2xl font-bold mb-4">Input Elements</h2>

          <div className="mb-2">
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded"
              onClick={() =>
                setTextInputs((prev) => [...prev, { type: "text" }])
              }
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
        </div>
        <div className="flex-1 p-4 ml-2 border border-gray-300">
          {textInputs.map((input, index) => (
            <div key={index} className="mb-2">
              <label
                htmlFor="input"
                className="block text-sm font-medium text-gray-700"
              >
                {input.label}
              </label>
              <input
                id="input"
                type={input?.type}
                className="p-2 border border-gray-300 rounded"
                placeholder={input.placeholder}
              />
              <button
                className="bg-blue-500 ml-3 text-white py-2 px-4 rounded"
                onClick={() => showModal(index)}
              >
                Edit
              </button>
              <Modal
                className="bg-transparent"
                open={open}
                title="Edit Input"
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                  <Button key="back" onClick={handleCancel}>
                    Cancel
                  </Button>,
                  <Button key="submit" type="primary" onClick={handleOk}>
                    Save
                  </Button>,
                ]}
              >
                <div className="mb-3">
                  <label
                    htmlFor="label"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Label
                  </label>
                  <input
                    type="text"
                    id="label"
                    name="label"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="Enter label"
                    className="mt-1 p-2 border border-gray-300 rounded w-full"
                  />
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="placeholderInput"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Placeholder
                  </label>
                  <input
                    type="text"
                    id="placeholderInput"
                    name="placeholder"
                    value={placeholder}
                    onChange={(e) => setPlaceholder(e.target.value)}
                    placeholder="Enter placeholder"
                    className="mt-1 p-2 border border-gray-300 rounded w-full"
                  />
                </div>
              </Modal>
              <button
                className="bg-red-500 ml-2 text-white py-2 px-4 rounded"
                onClick={() => handleDelete(index, "text")}
              >
                Delete
              </button>
            </div>
          ))}
          {selectedInputs
            .filter((value) => value?.type === "select")
            .map((input, index) => (
              <div key={index} className="mb-2">
                <label
                  htmlFor={`selectInput-${index}`}
                  className="block text-sm font-medium text-gray-700"
                >
                  {input.label}
                </label>
                <select
                  id={`selectInput-${index}`}
                  className="p-2 border border-gray-300 rounded"
                >
                  {input.options.map((option, optionIndex) => (
                    <option key={optionIndex} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <button
                  className="bg-blue-500 ml-3 text-white py-2 px-4 rounded"
                  onClick={() => showSelectModal(index)}
                >
                  Edit
                </button>

                <button
                  className="bg-red-500 ml-2 text-white py-2 px-4 rounded"
                  onClick={() => handleDelete(index, "select")}
                >
                  Delete
                </button>
              </div>
            ))}
          {radioInputs
            .filter((value) => value?.type === "radio")
            .map((input, index) => (
              <div key={index} className="mb-2">
                <label
                  htmlFor={`radioInput-${index}`}
                  className="block text-sm font-medium text-gray-700"
                >
                  {input.label}
                </label>
                <input
                  id={`radioInput-${index}`}
                  type="radio"
                  name={`radioGroup-${index}`}
                  className="p-2 border border-gray-300 rounded"
                  checked={index === selectedRadioIndex} // Check if this radio is selected
                  onChange={() => handleRadioChange(index)} // Handle
                />
                <button
                  className="bg-blue-500 ml-3 text-white py-2 px-4 rounded"
                  onClick={() => showModalRadio(index)}
                >
                  Edit
                </button>
                <Modal
                  className="bg-transparent"
                  open={openRadio && editIndex === index}
                  title="Edit Radio"
                  onOk={handleOkRadio}
                  onCancel={handleCancelRadio}
                  footer={[
                    <Button key="back" onClick={handleCancelRadio}>
                      Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleOkRadio}>
                      Save
                    </Button>,
                  ]}
                >
                  <div className="mb-3">
                    <label
                      htmlFor={`radioName-${index}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Radio Button Name
                    </label>
                    <input
                      type="text"
                      id={`radioName-${index}`}
                      name={`radioName-${index}`}
                      value={label}
                      onChange={(e) => setLabel(e.target.value)}
                      placeholder="Enter radio button name"
                      className="mt-1 p-2 border border-gray-300 rounded w-full"
                    />
                  </div>
                </Modal>
                <button
                  className="bg-red-500 ml-2 text-white py-2 px-4 rounded"
                  onClick={() => handleDelete(index, "radio")}
                >
                  Delete
                </button>
              </div>
            ))}
          {buttonInputs.map((button, index) => (
            <div key={index} className="mb-2 flex items-center">
              <button
                id={`buttonInput-${index}`}
                className="block text-sm font-medium bg-blue-200 p-2 rounded-md " // Add a class for light background color
              >
                {button.name}
              </button>
              <button
                className="bg-blue-500 ml-3 text-white py-2 px-4 rounded"
                onClick={() => showButtonModal(index)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 ml-2 text-white py-2 px-4 rounded"
                onClick={() => handleDelete(index, "button")}
              >
                Delete
              </button>
            </div>
          ))}

          <Modal
            className="bg-transparent"
            open={buttonModalVisible}
            title={editButtonIndex !== null ? "Edit Button" : "Add Button"}
            onOk={handleOkButton}
            onCancel={handleCancelButton}
            footer={[
              <Button key="back" onClick={handleCancelButton}>
                Cancel
              </Button>,
              <Button key="submit" type="primary" onClick={handleOkButton}>
                Save
              </Button>,
            ]}
          >
            <div className="mb-3">
              <label
                htmlFor="buttonName"
                className="block text-sm font-medium text-gray-700"
              >
                Button Name
              </label>
              <input
                type="text"
                id="buttonName"
                name="buttonName"
                value={buttonName}
                onChange={(e) => setButtonName(e.target.value)}
                placeholder="Enter button name"
                className="mt-1 p-2 border border-gray-300 rounded w-full"
              />
            </div>
          </Modal>
          {checkboxInputs
            .filter((value) => value?.type === "checkbox")
            .map((input, index) => (
              <div key={index} className="mb-2">
                <label
                  htmlFor={`checkboxInput-${index}`}
                  className="block text-sm font-medium text-gray-700"
                >
                  {input.label}
                </label>
                {/* Add your checkbox input here */}
                <input
                  id={`checkboxInput-${index}`}
                  type="checkbox"
                  name={`checkboxGroup-${index}`}
                  className="p-2 border border-gray-300 rounded"
                />
                <button
                  className="bg-blue-500 ml-3 text-white py-2 px-4 rounded"
                  onClick={() => showCheckboxModal(index)}
                >
                  Edit
                </button>
                <Modal
                  className="bg-transparent"
                  open={checkboxModalVisible && selectedCheckboxIndex === index}
                  title="Edit Checkbox"
                  onOk={handleCheckboxOk}
                  onCancel={handleCheckboxCancel}
                  footer={[
                    <Button key="back" onClick={handleCheckboxCancel}>
                      Cancel
                    </Button>,
                    <Button
                      key="submit"
                      type="primary"
                      onClick={handleCheckboxOk}
                    >
                      Save
                    </Button>,
                  ]}
                >
                  <div className="mb-3">
                    <label
                      htmlFor={`checkboxName-${index}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Checkbox Name
                    </label>
                    <input
                      type="text"
                      id={`checkboxName-${index}`}
                      name={`checkboxName-${index}`}
                      value={checkboxLabel || ""}
                      onChange={(e) => setCheckboxLabel(e.target.value)}
                      placeholder="Enter checkbox name"
                      className="mt-1 p-2 border border-gray-300 rounded w-full"
                    />
                  </div>
                </Modal>
                <button
                  className="bg-red-500 ml-2 text-white py-2 px-4 rounded"
                  onClick={() => handleDelete(index, "checkbox")}
                >
                  Delete
                </button>
              </div>
            ))}
          <div>
            <input
              type="text"
              placeholder="Enter Form Name"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              style={{
                margin: "5px",
                padding: "5px",
                borderRadius: "3px",
                border: "1px solid #ccc",
              }}
            />
            <button
              onClick={handleSubmitForm}
              style={{
                backgroundColor: "blue",
                color: "white",
                padding: "5px 10px",
                borderRadius: "3px",
                cursor: "pointer",
              }}
            >
              Submit Form
            </button>
          </div>
        </div>
      </div>
      <Modal
        className="bg-transparent"
        open={selectModalVisible}
        title="Edit Select"
        onOk={handleSelectOk}
        onCancel={handleSelectCancel}
        footer={[
          <Button key="back" onClick={handleSelectCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleSelectOk}>
            update{" "}
          </Button>,
        ]}
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Options
          </label>
          {options.map((option, optionIndex) => (
            <div key={optionIndex} className="flex items-center mb-2">
              <Input
                value={option}
                onChange={(e) => {
                  const updatedOptions = [...options];
                  updatedOptions[optionIndex] = e.target.value;
                  setOptions(updatedOptions);
                }}
                className="mr-2"
              />
              <Button
                type="primary"
                danger
                onClick={() => handleDeleteOption(optionIndex)}
              >
                Delete
              </Button>
            </div>
          ))}
          <Button type="dashed" onClick={handleAddOption}>
            Add Option
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default UserForm;
