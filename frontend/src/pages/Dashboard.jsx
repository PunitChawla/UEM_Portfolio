import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin"); // Redirect to signin if not authenticated
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-5">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center max-w-4xl"
      >
        <motion.h1
          className="text-5xl font-bold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Create Your AI-Powered Portfolio
        </motion.h1>
        <motion.p
          className="text-lg text-gray-400 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          Build your professional portfolio effortlessly with AI assistance.
          Showcase your skills, experience, and projects in just a few clicks!
        </motion.p>

        {/* Buttons Section */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Modified Button */}
          <motion.button
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-lg font-semibold transition transform hover:scale-105"
            onClick={() => navigate("/loginform")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Portfolio Built by Form Data
          </motion.button>

          {/* Updated Resume-Based Portfolio Button */}
          <motion.button
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-semibold transition transform hover:scale-105"
            onClick={() => navigate("/resume")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Portfolio Built by Resume
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
