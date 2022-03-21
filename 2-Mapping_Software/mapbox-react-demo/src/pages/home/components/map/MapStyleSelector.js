

import React from 'react'

const MapStyleSelector = ({mapStyle,mapStyleChangeHandler }) => {
    return (
       
            <form >
                <div>
                    <input
                        type="radio"
                        value="streets-v11"
                        checked={mapStyle === 'streets-v11'}
                        onChange={mapStyleChangeHandler}
                    /> Streets
                </div>
                <div>
                    <input
                        type="radio"
                        value="dark-v10"
                        checked={mapStyle === 'dark-v10'}
                        onChange={mapStyleChangeHandler}
                    /> Dark
                </div>
                <div>
                    <input
                        type="radio"
                        value="outdoors-v11"
                        checked={mapStyle === 'outdoors-v11'}
                        onChange={mapStyleChangeHandler} /> Outdoors
                </div>

            </form>
     
    )
}

export default MapStyleSelector;