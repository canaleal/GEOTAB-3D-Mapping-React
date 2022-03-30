

import React  from 'react'
import ModalListItem from './ModalListItem'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const LayerModal = ({ layerModalRef, closeModalHandler, staticLayers, dynamicLayers, layerButtonHandler }) => {



    return (
        <div ref={layerModalRef} className='popup-box flex flex-col rounded-lg p-5'>
            <div className='grid grid-cols-1  md:grid-cols-4  gap-4'>

                <div className='cols-span-1'>
                    <button onClick={() => closeModalHandler(layerModalRef)} className='border   w-full  rounded-md text-center p-2 btn-gray'>
                        <FontAwesomeIcon icon={`fa-solid fa-x`} />
                    </button>
                </div>
            </div>


            {staticLayers.length > 0 ?
                <>
                    <hr className='my-5'></hr>
                    <p className="text-xl font-bold">Static</p>
                    <div className='grid grid-cols-1 md:grid-cols-4  gap-4'>
                        {staticLayers.map((layer) => {
                            return (
                                <ModalListItem key={layer.id} layer={layer} layerButtonHandler={layerButtonHandler} />
                            )
                        })}
                    </div>
                </>
                :
                <></>
            }

            {dynamicLayers.length > 0 ?
                <>
                    <hr className='my-5'></hr>
                    <p className="text-xl font-bold">Dynamic</p>
                    <div className='grid grid-cols-1 md:grid-cols-4  gap-4'>
                        {dynamicLayers.map((layer) => {
                            return (
                                <ModalListItem key={layer.id} item={layer} layerButtonHandler={layerButtonHandler} />
                            )
                        })}
                    </div>
                </>
                :
                <></>
            }


        </div>

    )
}



export default LayerModal;