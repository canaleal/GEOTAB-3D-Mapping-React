


import React, { Fragment } from 'react'
import LayerButton from './LayerButton';


const LayerButtonGroup = ({ layers, layerHandler }) => {

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