import React from "react";

const portfolioData = {
  name: "Punit Chawla",
  profession: "Full-Stack Developer | Web3 Enthusiast",
  bio: "Passionate developer skilled in MERN stack, Web3, and cloud computing. Experienced in building decentralized platforms and scalable applications.",
  skills: [
    "Programming Languages: C, C++, JavaScript",
    "Problem-Solving: Strong analytical and problem-solving abilities",
    "Web Development: Full-Stack Development with MERN (MongoDB, Express.js, React.js, Node.js)",
    "Frontend Technologies: Next.js, React.js",
    "Database Management: PostgreSQL",
    "System Administration: Linux",
  ],
  education: [
    {
      name: "ARYA COLLEGE OF ENGINEERING AND IT",
      degree: "BTech Graduate",
      date: "July 2026",
      location: "Jaipur, Rajasthan",
      cgpa: "8.6 out of 10",
    },
    {
      name: "SANSKAR PUBLIC SCHOOL",
      degree: "12th Grade Graduate",
      date: "May 2021",
      location: "Jaipur, Rajasthan",
      percentage: "97.80%",
    },
    {
      name: "SANSKAR PUBLIC SCHOOL",
      degree: "10th Grade Graduate",
      date: "May 2019",
      location: "Jaipur, Rajasthan",
      percentage: "88.67%",
    },
  ],
  experience: [
    {
      title: "Decentralized Data Labeling Platform",
      description:
        "A Web3-powered SaaS platform for collaborative image labeling where users upload images, contribute votes or descriptions, and earn rewards for accurate contributions.",
      technologies: "Next.js 14, Tailwind CSS, TypeScript, Solana, AWS CloudFront",
      features:
        "Decentralized reward system, image upload with voting, scalable Web3 architecture, and AWS-powered performance",
      link: "https://github.com/PunitChawla/decentralized_data-labelling_platform",
    },
    {
      title: "Uptune",
      description:
        "Collaborative music player app for parties and events, allowing users to vote on and play music tracks.",
      technologies: "Next.js, PostgreSQL, Prisma (ORM), Express (routing)",
      features:
        "YouTube integration for video playback, automatic playback of most-voted tracks according to the vote system.",
      link: "https://github.com/PunitChawla/UpTune",
    },
    {
      title: "Blogging Website",
      description: "Platform for posting and reading user blogs",
      technologies:
        "React (frontend), Node.js (backend), PostgreSQL (database), Express (routing), TypeScript",
      deployment: "https://medium-blog-one-indol.vercel.app/",
    },
  ],
};

const Portfolio = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg mt-10">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">{portfolioData.name}</h1>
        <h2 className="text-xl text-gray-600 mt-2">{portfolioData.profession}</h2>
        <p className="mt-4 text-gray-700">{portfolioData.bio}</p>
      </div>

      {/* Skills Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800">Skills</h2>
        <ul className="list-disc list-inside text-gray-700 mt-2">
          {portfolioData.skills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </div>

      {/* Education Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800">Education</h2>
        {portfolioData.education.map((edu, index) => (
          <div key={index} className="mt-4 p-4 bg-white rounded shadow">
            <h3 className="text-xl font-semibold">{edu.degree}</h3>
            <p className="text-gray-600">{edu.name} - {edu.date}</p>
            <p className="text-gray-600">{edu.location}</p>
            {edu.cgpa && <p className="text-gray-600">CGPA: {edu.cgpa}</p>}
            {edu.percentage && <p className="text-gray-600">Percentage: {edu.percentage}</p>}
          </div>
        ))}
      </div>

      {/* Experience Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800">Experience</h2>
        {portfolioData.experience.map((exp, index) => (
          <div key={index} className="mt-4 p-4 bg-white rounded shadow">
            <h3 className="text-xl font-semibold">{exp.title}</h3>
            <p className="text-gray-600">{exp.description}</p>
            <p className="text-gray-600 mt-2"><strong>Technologies:</strong> {exp.technologies}</p>
            <p className="text-gray-600 mt-1"><strong>Features:</strong> {exp.features}</p>
            <a href={exp.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline mt-2 block">
              View Project
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Portfolio;
