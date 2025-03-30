import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.trim() });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/v1/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Signup Successful! Please login.");
        navigate("/signin"); // Redirect to signin page
      } else {
        if (data.error === "Email already exists!") {
          setError("This email is already registered. Try logging in.");
        } else {
          setError(data.error || "Signup failed. Try again.");
        }
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 text-white w-[900px] flex rounded-2xl overflow-hidden shadow-lg">
        {/* Left Side - Image Section */}
        <div className="w-1/2 relative hidden md:block">
          <img
            src="https://source.unsplash.com/600x800/?nature,landscape"
            alt="Signup"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="absolute bottom-5 left-5 text-white text-lg font-semibold">
            Capturing Moments, Creating Memories
          </div>
        </div>

        {/* Right Side - Form Section */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4">Create an Account</h2>
          <p className="text-gray-400 text-sm">
            Already have an account?{" "}
            <Link to="/signin" className="text-purple-400">
              Log in
            </Link>
          </p>

          {error && <p className="text-red-500 mt-2">{error}</p>}

          <form onSubmit={handleSubmit} className="mt-5">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 mt-3 rounded-lg bg-gray-700 text-white outline-none"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 mt-3 rounded-lg bg-gray-700 text-white outline-none"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 mt-3 rounded-lg bg-gray-700 text-white outline-none"
              required
            />
            <div className="flex items-center mt-3">
              <input type="checkbox" id="terms" className="mr-2" required />
              <label htmlFor="terms" className="text-gray-400 text-sm">
                I agree to the{" "}
                <a href="#" className="text-purple-400">
                  Terms & Conditions
                </a>
              </label>
            </div>
            <button
              type="submit"
              className="w-full mt-5 p-3 bg-purple-600 rounded-lg text-white font-semibold hover:bg-purple-700 transition"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
