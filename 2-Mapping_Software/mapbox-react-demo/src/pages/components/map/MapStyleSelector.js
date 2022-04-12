

import React, { useState } from 'react'

const MapStyleSelector = ({ mapStyle, mapStyleChangeHandler }) => {

    const [mapStyleOptions, setMapStyleOptions] = useState([
        { 'name': 'Streets', 'value': 'streets-v11' },
        { 'name': 'Dark', 'value': 'dark-v10' },
        { 'name': 'Outdoors', 'value': 'outdoors-v11' },
        { 'name': 'Satellite', 'value': 'satellite-streets-v11' }

    ])



    return (




        <form >


            {
                mapStyleOptions.map((item) => {
                    return (
                        <div key={item.name}>
                            <input
                                id={item.name}
                                type="radio"
                                value={item.value}
                                checked={mapStyle === item.value}
                                onChange={mapStyleChangeHandler}
                            />
                            <label className='text-sm ml-2' htmlFor={item.name}>{item.name}</label> 
                        </div>
                    )
                })

            }


        </form>





    )
}

export default React.memo(MapStyleSelector);