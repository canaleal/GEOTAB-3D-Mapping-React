import React from 'react'

const Footer = ({showModalHandler, helpModalRef }) => {




  return (
    <div className='h-fit  py-10 px-5 bg-black color-white '>

      <div className='grid grid-cols-4 gap-4'>

        <div className='col-span-2'>
        
        </div>


        <div className='col-span-2 text-right'>   
          <button onClick={() => showModalHandler(helpModalRef)} className="border border-white w-16 rounded-md">
            <span className='text-md weight-bold   '>Help</span>
          </button>
        </div>

      </div>



    </div>
  )
}

export default Footer;