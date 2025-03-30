import React from 'react'

const TopSkill = () => {
    const skillHead="WebDevlopment";
    const skillDisc="I am a skilled web developer with expertise in MERN stack (MongoDB, Express.js, React.js, Node.js), along with HTML, CSS, JavaScript, and REST APIs. I have experience building responsive, dynamic, and user-friendly web applications, integrating databases, authentication"
  return (
    <div className='m-2 p-4'>
        <div className='m-2 font-medium text-xl'>
            {skillHead}
        </div>
        <div>
            {skillDisc}

        </div>
    </div>
  )
}

export default TopSkill