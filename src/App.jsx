import React, { useState, useEffect } from "react";

const DynamicForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
    interests: [],
  });
  const [errors, setErrors] = useState({});
  const [additionalFields, setAdditionalFields] = useState([]);

  useEffect(() => {
    if (step === 2) {
      fetchAdditionalFields();
    }
  }, [step]);

  const fetchAdditionalFields = async () => {
    try {
      // Simulating API call
      const response = await new Promise((resolve) =>
        setTimeout(
          () =>
            resolve({
              fields: [
                { name: "age", type: "number", label: "Age" },
                {
                  name: "gender",
                  type: "select",
                  label: "Gender",
                  options: ["Male", "Female", "Other"],
                },
                {
                  name: "interests",
                  type: "checkbox",
                  label: "Interests",
                  options: ["Sports", "Music", "Movies", "Travel"],
                },
              ],
            }),
          1000
        )
      );
      setAdditionalFields(response.fields);
    } catch (error) {
      console.error("Error fetching additional fields:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked
          ? [...(prevData[name] || []), value]
          : (prevData[name] || []).filter((item) => item !== value),
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = "Name is required";
      if (!formData.email.trim()) newErrors.email = "Invalid email format";
    } else if (step === 2) {
      if (!formData.age) newErrors.age = "Age is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (step === 1) {
        setStep(2);
      } else {
        // Final submission
        console.log("Form submitted:", formData);
        setStep(3);
      }
    }
  };

  const renderField = (field) => {
    switch (field.type) {
      case "text":
      case "email":
      case "number":
        return (
          <input
            type={field.type}
            name={field.name}
            value={formData[field.name]}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        );
      case "select":
        return (
          <select
            name={field.name}
            value={formData[field.name]}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="">Select {field.label}</option>
            {field.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case "checkbox":
        return (
          <div>
            {field.options.map((option) => (
              <label key={option}>
                <input
                  type="checkbox"
                  name={field.name}
                  value={option}
                  checked={(formData[field.name] || []).includes(option)}
                  onChange={handleInputChange}
                  className="form-checkbox h-5 w-5 text-gray-600"
                />
                <span className="ml-2 text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  if (step === 3) {
    return (
      <div className="max-w-md mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-4">Registration Summary</h2>
        {Object.entries(formData).map(([key, value]) => (
          <p key={key} className="mb-2">
            <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{" "}
            {Array.isArray(value) ? value.join(", ") : value}
          </p>
        ))}
      </div>
    );
  }

  return (

      <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-4">Dynamic Form</h2>
        {step === 1 && (
          <>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Name
              </label>
              {renderField({ type: "text", name: "name" })}
              {errors.name && (
                <p className="text-red-500 text-xs italic">{errors.name}</p>
              )}
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              {renderField({ type: "email", name: "email" })}
              {errors.email && (
                <p className="text-red-500 text-xs italic">{errors.email}</p>
              )}
            </div>
          </>
        )}
        {step === 2 &&
          additionalFields.map((field) => (
            <div key={field.name}>
              <label htmlFor={field.name}>{field.label}</label>
              {renderField(field)}
              {errors[field.name] && <p>{errors[field.name]}</p>}
            </div>
          ))}
        <button type="submit" className="">
          {step === 1 ? "Next" : "Submit"}
        </button>
      </form>
 
  );
};

export default DynamicForm;

function Layout({ children }) {
  return <div className="layout">{children}</div>;
}
