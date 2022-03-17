import React, { Component, useRef, useState, useEffect } from 'react'

const Footer = ({ city, showModalHandler, aboutModalRef, helpModalRef }) => {




  return (
    <div className='h-fit  py-10 px-5 bg-black color-white '>

      <div className='grid grid-cols-4 gap-4'>

        <div className='col-span-2'>
          <span>Nisi dolore tempor aliquip eu incididunt. Amet esse nostrud reprehenderit voluptate qui. Aute duis incididunt velit aliqua quis fugiat cillum sit reprehenderit deserunt incididunt sint cillum. Eiusmod elit ullamco duis incididunt. Non proident officia nulla enim.</span>


        </div>


        <div className='col-span-2 text-right'>
          {/* <button onClick={() => showModalHandler(aboutModalRef)} className="border border-white mr-5 w-16 rounded-md">
            <span className='text-md weight-bold '>About</span>
          </button> */}
          <button onClick={() => showModalHandler(helpModalRef)} className="border border-white w-16 rounded-md">
            <span className='text-md weight-bold   '>Help</span>
          </button>
        </div>

      </div>



    </div>
  )
}

export default Footer;