


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


          



        </Fragment>
    )
}


export default React.memo(LayerButtonGroup);