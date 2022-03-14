import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const HelpModal = ({helpModalRef, closeModalHandler}) => {
  return (
    <div ref={helpModalRef} className='popup-box flex flex-col rounded-lg px-5 py-5'>

        <div className='grid grid-cols-4  gap-4'>
                <button onClick={() => closeModalHandler(helpModalRef)} className='border  text-center p-3 my-1  w-full px-4 rounded-md border-black-500 bg-slate-0 hover:bg-slate-200'>
                  <FontAwesomeIcon icon={`fa-solid fa-x`} />
                </button>
         </div>

        <hr className='my-5'></hr>
        <p className='text-lg weight-bold'>Help</p>
        <p>Voluptate excepteur pariatur dolor aute fugiat. Ullamco commodo incididunt cupidatat cillum aliqua velit voluptate laboris ea nulla esse cillum id. Exercitation do incididunt est reprehenderit ex enim sit consequat. Dolore Lorem quis voluptate nulla.</p>
    </div>
  )
}

export default HelpModal;