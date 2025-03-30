import React, { useState } from "react";
import ImageUpload from "../Components/ImageUpload";

const InputForm = () => {
  const [category, setCategory] = useState("");
  const [formData, setFormData] = useState({
    profilePicture: "",
    firstName: "",
    email: "",
    mobile: "",
    education10: "",
    education12: "",
    educationGrad: "",
    category: "",
    githubUrl: "",
    leetcodeId: "",
    gfgProfile: "",
    softSkills: "",
    department: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem("token"); // Get token from localStorage
  
    if (!token) {
      alert("Authorization token missing. Please log in again.");
      return;
    }
  
    const requiredFields = ["profilePicture", "firstName", "email", "mobile", "education10", "education12", "educationGrad"];
  
    if (requiredFields.some(field => formData[field] === "")) {
      alert("Please fill in all required fields.");
      return;
    }
  
    const submissionData = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => value !== "")
    );
  
    try {
      const res = await fetch("http://localhost:5000/v1/user/profile", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Add token to the request
        },
        body: JSON.stringify(submissionData),
      });
  
      const data = await res.json();
      console.log("Form submitted successfully:", data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 text-white w-[900px] p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold mb-4">Personal Information</h2>

        <form onSubmit={handleSubmit}>
          <label className="block mb-3">Profile Picture*</label>
          <ImageUpload setProfilePicture={(url) => setFormData({ ...formData, profilePicture: url })} />
          
          <input type="text" name="firstName" placeholder="Name*" className="w-full p-3 mt-4 bg-gray-700 text-white" required onChange={handleChange} />
          <input type="email" name="email" placeholder="Email*" className="w-full p-3 mt-4 bg-gray-700 text-white" required onChange={handleChange} />
          <input type="text" name="mobile" placeholder="Mobile No.*" className="w-full p-3 mt-4 bg-gray-700 text-white" required onChange={handleChange} />

          <h3 className="mt-4 text-lg font-semibold">Education*</h3>
          <input type="text" name="education10" placeholder="10th Percentage / CGPA" className="w-full p-3 mt-2 bg-gray-700 text-white" required onChange={handleChange} />
          <input type="text" name="education12" placeholder="12th Percentage / CGPA" className="w-full p-3 mt-2 bg-gray-700 text-white" required onChange={handleChange} />
          <input type="text" name="educationGrad" placeholder="Graduation (Course & University)" className="w-full p-3 mt-2 bg-gray-700 text-white" required onChange={handleChange} />

          <h3 className="mt-4 text-lg font-semibold">Select Category*</h3>
          <select
            name="category"
            className="w-full p-3 mt-2 bg-gray-700 text-white"
            onChange={(e) => { setCategory(e.target.value); handleChange(e); }}
          >
            <option value="">-- Select --</option>
            <option value="cs">Computer Science</option>
            <option value="non-tech">Non-Technical</option>
          </select>

          {category === "cs" && (
            <div className="mt-4">
              <input type="url" name="githubUrl" placeholder="GitHub URL" className="w-full p-3 mt-2 bg-gray-700 text-white" onChange={handleChange} />
              <input type="text" name="leetcodeId" placeholder="Leetcode ID" className="w-full p-3 mt-2 bg-gray-700 text-white" onChange={handleChange} />
              <input type="text" name="gfgProfile" placeholder="GeeksforGeeks Profile URL" className="w-full p-3 mt-2 bg-gray-700 text-white" onChange={handleChange} />
            </div>
          )}

          {category === "non-tech" && (
            <div className="mt-4">
              <textarea name="softSkills" placeholder="Soft Skills" className="w-full p-3 mt-2 bg-gray-700 text-white" onChange={handleChange}></textarea>
              <input type="text" name="department" placeholder="Department" className="w-full p-3 mt-2 bg-gray-700 text-white" onChange={handleChange} />
            </div>
          )}

          <textarea name="additionalInfo" placeholder="Additional Information" className="w-full p-3 mt-4 bg-gray-700 text-white" onChange={handleChange}></textarea>

          <button type="submit" className="w-full mt-5 p-3 bg-purple-600">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default InputForm;