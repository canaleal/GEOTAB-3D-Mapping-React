

import React, { useEffect, useState } from 'react'
import ModalListItem from './ModalListItem'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const LayerModal = ({ layerModalRef, closeModalHandler, staticLayers, dynamicLayers, layerButtonHandler }) => {




    return (
        <div ref={layerModalRef} className='popup-box flex flex-col rounded-lg p-5'>
            <div className='grid grid-cols-4  gap-4'>

                <div className='cols-span-1'>
                    <button onClick={() => closeModalHandler(layerModalRef)} className='border  text-center p-3 my-1  w-full px-4 rounded-md border-black-500 bg-slate-0 hover:bg-slate-200'>
                        <FontAwesomeIcon icon={`fa-solid fa-x`} />
                    </button>
                </div>
            </div>



            <hr className='my-5'></hr>
            <p className="text-xl font-bold">Static</p>
            <div className='grid grid-cols-4  gap-4'>
                {staticLayers.map((item) => {
                    return (
                        <ModalListItem key={item.id} item={item} layerButtonHandler={layerButtonHandler} />
                    )
                })}
            </div>



            <hr className='my-5'></hr>
            <p className="text-xl font-bold">Dynamic</p>
            <div className='grid grid-cols-4  gap-4'>
                {dynamicLayers.map((item) => {
                    return (
                        <ModalListItem key={item.id} item={item} layerButtonHandler={layerButtonHandler} />
                    )
                })}
            </div>


        </div>

    )
}



export default LayerModal;