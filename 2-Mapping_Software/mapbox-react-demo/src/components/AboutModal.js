import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const AboutModal = ({aboutModalRef, closeModalHandler}) => {
  return (
    <div ref={aboutModalRef} className='popup-box flex flex-col rounded-lg px-5 py-5'>
  
        <div className='grid grid-cols-4  gap-4'>
                <button onClick={() => closeModalHandler(aboutModalRef)} className='border  text-center p-3 my-1  w-full px-4 rounded-md border-black-500 bg-slate-0 hover:bg-slate-200'>
                  <FontAwesomeIcon icon={`fa-solid fa-x`} />
                </button>
         </div>

        <hr className='my-5'></hr>
        <p className='text-lg weight-bold'>About</p>
        <p>Kingston is a Canadian city on Lake Ontario, at the mouth of the Cataraqui and St. Lawrence rivers. It's known as the "Limestone City" for its grand 19th-century buildings, including the lakeside Kingston City Hall.</p>

        <p>The City promotes and fosters open government principles of participation, innovation, transparency and accountability. The data catalogue supports these principles and is the first step in making it easier to view, obtain and use the information the City has gathered.</p>
        
        <img className='' src='https://perspective.ca/wp-content/uploads/2018/10/city-of-kingston-ontario-perspective-globe-and-mail.jpg' about='city'/>
    </div>
  )
}

export default AboutModal;