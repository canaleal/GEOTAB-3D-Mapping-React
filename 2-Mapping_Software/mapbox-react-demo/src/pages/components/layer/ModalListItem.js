

import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const ModalListItem = ({ layer, layerButtonHandler }) => {
    return (
        <div className="col-span-1  rounded-lg overflow-hidden shadow-lg">

            <img height="100" width="auto" className="w-full h-32 object-none" src={`http://localhost:3000/assets/images/${layer.imgPath}`} alt='' />

            <div className="p-2">
                <p className="font-bold my-2">{layer.layer}</p>
                <p>View data displayed on maps to better visualize the city and surrounding area.</p>

                <button className={`border  w-full text-center  ${layer.showButton ? 'btn-blue' : 'btn-gray'} `}
                    onClick={() => layerButtonHandler(layer)}>
                    <FontAwesomeIcon icon={`fa-solid ${layer.icon}`} />
                </button>
            </div>

        </div>
    )
}

export default ModalListItem;