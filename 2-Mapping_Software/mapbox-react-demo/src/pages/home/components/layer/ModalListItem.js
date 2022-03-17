

import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const ModalListItem = ({ item, layerButtonHandler }) => {
    return (
        <div  className="col-span-4 md:col-span-1  rounded overflow-hidden shadow-lg">
           
            <img className="w-full h-32 object-none" src={`http://localhost:3000/assets/images/${item.imgPath}`} alt="Layer Image" />
        
            <div className="p-4">
                <p className="font-bold mb-2">{item.layer}</p>
                <p>View data displayed on maps to better visualize the city and surrounding area.</p>

                <button className={`border  block w-full text-center p-3 my-1 rounded-md ${item.showButton ? 'bg-blue-500 hover:bg-blue-700 color-white' : 'border-black-500 bg-slate-0 hover:bg-slate-200'} `} onClick={() => layerButtonHandler(item)}>
                    <FontAwesomeIcon icon={`fa-solid ${item.icon}`} />
                </button>
            </div>

        </div>
    )
}

export default ModalListItem;