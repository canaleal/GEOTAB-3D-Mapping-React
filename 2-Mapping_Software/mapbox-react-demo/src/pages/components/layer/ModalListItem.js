

import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const ModalListItem = ({ layer, layerButtonHandler }) => {
    const current_web_location  = window.location.protocol + "//" + window.location.host;
    return (
        <div className="col-span-1  rounded-lg overflow-hidden shadow-lg">

            <img height="100" width="auto" className="w-full h-32 object-none" src={`${current_web_location}/assets/images/${layer.imgPath}`} alt='' />

            <div className="p-2">
                <p className="font-bold my-2">{layer.layer}</p>
                <p>View data displayed on maps to better visualize the city and surrounding area.</p>

                <button  className={`border  w-full text-left ${layer.showButton ?'btn-blue' : 'btn-gray'} `}
                    onClick={() => layerButtonHandler(layer)}>
                    <FontAwesomeIcon icon={`fa-solid ${layer.icon} `} size="xl" width={"2rem"}/><span>{layer.layer}</span>
                </button>
            </div>

        </div>
    )
}

export default ModalListItem;