import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const response = await fetch("http://localhost:5000/v1/user/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token); // Store JWT token
        navigate("/dashboard"); // Redirect to dashboard
      } else {
        setError(data.error); // Show error message
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 text-white w-[900px] flex rounded-2xl overflow-hidden shadow-lg">
        {/* Left Side - Image Section */}
        <div className="w-1/2 relative hidden md:block">
          <img
            src="https://source.unsplash.com/600x800/?nature,landscape"
            alt="Login"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="absolute bottom-5 left-5 text-white text-lg font-semibold">
            Capturing Moments, Creating Memories
          </div>
        </div>

        {/* Right Side - Form Section */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4">Login into Account</h2>
          <p className="text-gray-400 text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-purple-400">
              Sign up
            </Link>
          </p>

          {error && <p className="text-red-500 mt-3">{error}</p>}

          <form onSubmit={handleLogin} className="mt-5">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded-lg bg-gray-700 text-white outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full p-3 mt-3 rounded-lg bg-gray-700 text-white outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="flex justify-between items-center mt-3">
              <div className="flex items-center">
                <input type="checkbox" id="remember" className="mr-2" />
                <label htmlFor="remember" className="text-gray-400 text-sm">
                  Remember Me
                </label>
              </div>
              <a href="#" className="text-purple-400 text-sm">
                Forgot Password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full mt-5 p-3 bg-purple-600 rounded-lg text-white font-semibold hover:bg-purple-700 transition"
            >
              Login
            </button>
          </form>

          <div className="flex items-center mt-5">
            <hr className="w-30 border-gray-600" />
            <span className="mx-3 text-gray-400">Or login with</span>
            <hr className="w-30 border-gray-600" />
          </div>

          <div className="flex justify-center gap-4 mt-5">
            <button className="flex items-center gap-2 px-5 py-2 bg-gray-700 rounded-lg text-white">
              <img
                src="https://img.icons8.com/color/48/google-logo.png"
                className="w-5"
                alt="Google"
              />
              Google
            </button>
            <button className="flex items-center gap-2 px-5 py-2 bg-gray-700 rounded-lg text-white">
              <img
                src="https://img.icons8.com/ios-filled/50/ffffff/mac-os.png"
                className="w-5"
                alt="Apple"
              />
              Apple
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
