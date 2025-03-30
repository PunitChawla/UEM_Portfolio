const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const dotenv = require("dotenv");
const cors = require("cors");
const axios = require("axios")
const router = express.Router();

// Allow all origins, methods, and headers

const app = express();
dotenv.config();
app.use(cors({ origin: "*", methods: "*", allowedHeaders: "*" }));
const prisma = new PrismaClient();
app.use(express.json());


const SECRET_KEY = "your_secret_key";

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


const authenticateUser = (req, res, next) => {
    const token = req.header("Authorization");
  
    if (!token) {
      return res.status(401).json({ error: "Access denied. No token provided!" });
    } 
  
    try {
      const decoded = jwt.verify(token.replace("Bearer ", ""), SECRET_KEY);
      req.user = decoded; // Attach user data to request object
      next();
    } catch (error) {
      res.status(403).json({ error: "Invalid or expired token!" });
    }
  };
  
  



  app.post("/v1/user/profile", authenticateUser, async (req, res) => {
    const {
        imgUrl,
        linkedin,
        instagram,
        leetcode,
        contactNo,
        mobile,
        education10,
        education12,
        educationGrad,
        category,
        githubUrl,
        leetcodeId,
        gfgProfile,
        projectFile,
        softSkills,
        department,
        additionalInfo
    } = req.body;

    try {
        const userProfile = await prisma.userProfile.upsert({
            where: { userId: req.user.userId },
            update: {
                imgUrl,
                linkedin,
                instagram,
                leetcode,
                contactNo,
                mobile,
                education10,
                education12,
                educationGrad,
                category,
                githubUrl,
                leetcodeId,
                gfgProfile,
                projectFile,
                softSkills,
                department,
                additionalInfo
            },
            create: {
                userId: req.user.userId,
                imgUrl,
                linkedin,
                instagram,
                leetcode,
                contactNo,
                mobile,
                education10,
                education12,
                educationGrad,
                category,
                githubUrl,
                leetcodeId,
                gfgProfile,
                projectFile,
                softSkills,
                department,
                additionalInfo
            },
        });

        res.json({ message: "Profile updated successfully!", userProfile });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ error: "Failed to update profile!" });
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
  const { imgUrl } = req.body;
  const userId = req.user.id;
  console.log("Received Image URL:", imgUrl);

  if (!imgUrl) {
      return res.status(400).json({ error: "Image URL is required." });
  }

  try {
      // 🔹 Convert Image URL to Base64
      const base64Image = await convertImageToBase64(imgUrl);

      // 🔹 Send Resume Image to Gemini API
      const geminiResponse = await axios.post(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyAlg-et9LOZZm98HRxVproqXDqN0NCmvLQ",
          {
              contents: [
                  {
                      role: "user",
                      parts: [
                          { text: "Extract skills, education, and work experience from this resume." },
                          { inlineData: { mimeType: "image/png", data: base64Image } }
                      ]
                  }
              ]
          },
          {
              headers: {
                  "Content-Type": "application/json"
              }
          }
      );

      console.log("Gemini Response:", geminiResponse.data);
      
      // 🔹 Extract structured JSON from Gemini's response
      const extractedData = geminiResponse.data.candidates[0].content.parts[0].text;
      
      res.status(201).json({
          message: "Resume uploaded & analyzed successfully!",
          extractedData: JSON.parse(extractedData)
      });

  } catch (error) {
      console.error("Gemini API Error:", error.response ? error.response.data : error.message);
      res.status(500).json({ error: "Failed to upload and analyze resume", details: error.message });
  }
});



// ✅ GET: Fetch Resume (Protected Route)
router.get("/v1/user/resume", authenticateUser, async (req, res) => {
    const userId = req.user.id; // Extracted from authMiddleware

    try {
        const resume = await prisma.resume.findUnique({
            where: { userId }
        });

        if (!resume) {
            return res.status(404).json({ error: "Resume not found" });
        }

        res.json(resume);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching resume" });
    }
});
app.listen(5000, () => console.log("Server running on port 5000"));
