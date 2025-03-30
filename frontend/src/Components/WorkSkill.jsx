import React from 'react'

function Skill() {
  return (
    <div className="flex flex-wrap gap-3 mt-3">
            {[
              "NEXT.js",
              "React.js",
              "HTML 5",
              "CSS 3",
              "Tailwind CSS",
              "Figma",
              "JavaScript",
              "Mongo DB",
              "SQL",
              "Angular",
              "Android",
              "Git",
            ].map((skill, index) => (
              <span
                key={index}
                className="bg-gray-500 text-white px-3 py-1 rounded-xl text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
  )
}

export default Skill