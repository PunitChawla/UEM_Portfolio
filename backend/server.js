const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const dotenv = require("dotenv");
const cors = require("cors");
const axios = require("axios");
const router = express.Router();

const app = express();
dotenv.config();
app.use(cors({ origin: "*", methods: "*", allowedHeaders: "*" }));
const prisma = new PrismaClient();
app.use(express.json());

const SECRET_KEY = "your_secret_key";

// ✅ User Signup
app.post("/v1/user/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });
    res.status(201).json({ message: "User created successfully!", user });
  } catch (error) {
    res.status(400).json({ error: "Email already exists!" });
  }
});

// ✅ User Signin
app.post("/v1/user/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found!" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: "Invalid credentials!" });

    const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ message: "Login successful!", token });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong!" });
  }
});

// ✅ Authentication Middleware
const authenticateUser = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) return res.status(401).json({ error: "Access denied. No token provided!" });

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), SECRET_KEY);
    req.user = decoded; // Attach user data to request object
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid or expired token!" });
  }
};

// ✅ User Profile Update
app.post("/v1/user/profile", authenticateUser, async (req, res) => {
  const { imgUrl, mobile, education10, education12, educationGrad, category, githubUrl, leetcodeId, gfgProfile, softSkills, department, additionalInfo } = req.body;

  try {
    const userProfile = await prisma.userProfile.upsert({
      where: { userId: req.user.userId },
      update: {
        imgUrl, mobile, education10, education12, educationGrad, category, githubUrl, leetcodeId, gfgProfile, softSkills, department, additionalInfo,
      },
      create: {
        userId: req.user.userId,
        imgUrl, mobile, education10, education12, educationGrad, category, githubUrl, leetcodeId, gfgProfile, softSkills, department, additionalInfo,
      },
    });

    res.json({ message: "Profile updated successfully!", userProfile });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Failed to update profile!" });
  }
});


app.get("/v1/user/profile", authenticateUser, async (req, res) => {
  try {
    const userProfile = await prisma.userProfile.findUnique({
      where: { userId: req.user.userId },
    });

    if (!userProfile) {
      return res.status(404).json({
        error: "User profile not found",
        imgUrl: null,
        mobile: "Not Provided",
        education10: "No details available",
        education12: "No details available",
        educationGrad: "No details available",
        category: "Not Specified",
        githubUrl: "Not Provided",
        leetcodeId: "Not Provided",
        gfgProfile: "Not Provided",
        softSkills: "Not Listed",
        department: "Not Specified",
        additionalInfo: "No additional information available",
      });
    }

    res.json(userProfile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Failed to fetch profile!" });
  }
});



async function convertImageToBase64(imageUrl) {
  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    return Buffer.from(response.data, "binary").toString("base64");
  } catch (error) {
    console.error("Error converting image to Base64:", error.message);
    throw new Error("Failed to process image for AI analysis.");
  }
}

app.post("/v1/user/resume", authenticateUser, async (req, res) => {
  const { imgUrl, resumeUrl } = req.body;  // ✅ Extract `resumeUrl` from request body
  console.log("Received Resume URL:", resumeUrl);

  if (!imgUrl || !resumeUrl) {
    return res.status(400).json({ error: "Both Resume Image URL and Resume URL are required." });
  }

  try {
    const base64Image = await convertImageToBase64(imgUrl);

    const geminiResponse = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyAlg-et9LOZZm98HRxVproqXDqN0NCmvLQ",
      {
        contents: [
          {
            role: "user",
            parts: [
              { text: "Extract name, email, phone, skills, education, and work experience from this resume." },
              { inlineData: { mimeType: "image/png", data: base64Image } },
            ],
          },
        ],
      },
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("\n--- Extracted Resume Data ---");
    const extractedDataText = geminiResponse.data.candidates[0].content.parts[0].text;
    let extractedData;
    try {
      extractedData = JSON.parse(extractedDataText);
    } catch (error) {
      extractedData = extractedDataText;
    }

    console.log(extractedData);

    const userId = req.user.userId;

    // ✅ Store Resume URL in Database (Inside Resume Table)
    await prisma.resume.upsert({
      where: { userId },
      update: { imgUrl, resumeUrl },  // ✅ Use the provided `resumeUrl`
      create: {
        userId,
        imgUrl,
        resumeUrl,  // ✅ Use the provided `resumeUrl`
      },
    });

    // ✅ Update User Profile with Extracted Data
    await prisma.userProfile.upsert({
      where: { userId },
      update: {
        imgUrl, // Set Profile Picture as Resume Image
        mobile: extractedData.phone || null,
        educationGrad: extractedData.education || null,
        additionalInfo: JSON.stringify(extractedData),
      },
      create: {
        userId,
        imgUrl,
        mobile: extractedData.phone || null,
        educationGrad: extractedData.education || null,
        additionalInfo: JSON.stringify(extractedData),
      },
    });

    res.status(201).json({
      message: "Resume uploaded & processed successfully!",
      resumeUrl, // ✅ Send back the provided resume URL
    });

  } catch (error) {
    console.error("Gemini API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to analyze resume", details: error.message });
  }
});


// ✅ Fetch Resume (GET)
app.get("/v1/user/resume", authenticateUser, async (req, res) => {
  const userId = req.user.userId;

  try {
    let userProfile = await prisma.userProfile.findUnique({ where: { userId } });

    if (!userProfile) {
      return res.json({
        name: "No Name Available",
        email: "Not Provided",
        phone: "Not Provided",
        educationGrad: "No education details available",
        imgUrl: "",
        additionalInfo: {},
      });
    }

    res.json({
      name: userProfile.name || "No Name Available",
      email: userProfile.email || "Not Provided",
      phone: userProfile.mobile || "Not Provided",
      educationGrad: userProfile.educationGrad || "No education details available",
      imgUrl: userProfile.imgUrl || "",
      additionalInfo: userProfile.additionalInfo ? JSON.parse(userProfile.additionalInfo) : {},
    });

  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Error fetching user profile" });
  }
});


// ✅ Start Server
app.listen(5000, () => console.log("Server running on port 5000"));
