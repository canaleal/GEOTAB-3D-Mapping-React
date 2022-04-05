


import React, { Fragment, useEffect } from 'react'
import LayerButton from './LayerButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const LayerButtonGroup = ({ layers, layerModalRef, layerHandler, showModalHandler }) => {

    return (


        <Fragment>


            <p className="font-bold">Layers</p>
            
            {layers.map((item) => (
                <span key={item.id}>
                    {item.showButton ? (
                        <LayerButton item={item} layerHandler={layerHandler} />
                    ) : (
                        <></>
                    )}
                </span>
            ))}


            <button onClick={() => showModalHandler(layerModalRef)} className={`border slide-in-left  w-full text-left my-1 btn-gray mt-10`}>
                <FontAwesomeIcon
                    icon="fa-solid fa-layer-group"
                    size="lg"
                    width={"2rem"}
                /><span>Add/Remove Layers</span>
            </button>



        </Fragment>
    )
}


export default LayerButtonGroup;