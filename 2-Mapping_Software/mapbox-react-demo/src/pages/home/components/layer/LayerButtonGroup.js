


import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import LayerButton from './LayerButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const LayerButtonGroup = ({ layers, layerModalRef, layerHandler, showModalHandler }) => {

    return (


        <>


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


            <button onClick={() => showModalHandler(layerModalRef)}
                className={`border slide-in-left  w-full text-left my-1 btn-gray mt-10`}
            >
                <FontAwesomeIcon
                    icon="fa-solid fa-layer-group"
                    size="lg"
                    width={"2rem"}
                /><span>Add/Remove Layers</span>
            </button>



        </>
    )
}


export default LayerButtonGroup;