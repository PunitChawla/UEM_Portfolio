import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [backendData, setBackendData] = useState(null);
  const [message, setMessage] = useState("");

  const navigate = useNavigate(); // Corrected import and function name

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const uploadResume = async () => {
    if (!file) {
      setMessage("Please select a file.");
      return;
    }

    setUploading(true);
    setMessage("");

    try {
      // 1️⃣ Upload file to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "uem29032005arya");

      const cloudResponse = await axios.post(
        "https://api.cloudinary.com/v1_1/dfua9bj2q/upload",
        formData
      );

      const uploadedResumeUrl = cloudResponse.data.secure_url;

      // 2️⃣ Send URL to Backend & Get AI Response
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Authentication required. Please log in.");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/v1/user/resume",
        { imgUrl: uploadedResumeUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 3️⃣ Store Backend Response Directly
      setBackendData(response.data);
    } catch (error) {
      console.error("Upload Error:", error);
      setMessage("Error processing your resume.");
    } finally {
      setUploading(false);
      navigate("/resumebuilder"); // Corrected navigation function
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-100 rounded-lg shadow-lg mt-10">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Upload Resume
      </h2>
      
      <input
        type="file"
        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
        onChange={handleFileChange}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm mb-4"
      />

      <button
        onClick={uploadResume}
        disabled={uploading}
        className={`w-full py-2 px-4 rounded-md text-white ${
          uploading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {uploading ? "Processing..." : "Upload & Get Data"}
      </button>

      {message && <p className="mt-4 text-red-600">{message}</p>}

      {/* Display Raw Backend Response */}
      {backendData && (
        <div className="mt-6 p-4 bg-gray-200 rounded">
          <h3 className="text-lg font-bold">Backend Response:</h3>
          <pre className="text-xs bg-white p-2 rounded overflow-auto">
            {JSON.stringify(backendData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
