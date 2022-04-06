

import React, { Fragment, useEffect, useState } from 'react'

const MapStyleSelector = ({ mapStyle, mapStyleChangeHandler }) => {

    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [mapStyleOptions, setMapStyleOptions] = useState([])

    useEffect(() => {

        try {
            setMapStyleOptions([
                { 'name': 'Streets', 'value': 'streets-v11'},
                { 'name': 'Dark', 'value': 'dark-v10' },
                { 'name': 'Outdoors', 'value': 'outdoors-v11' },
                { 'name': 'Satellite', 'value': 'satellite-streets-v11' }

            ])
            setIsLoaded(true)
        }
        catch {
            setIsLoaded(true);
            setError(true);
        }

    }, [])



    return (


        <Fragment >

            {isLoaded ?

                error ?
                    <p>Error! Unable to load map selector.</p>
                    :
                    <form >


                        {
                            mapStyleOptions.map((item) => {
                                return (
                                    <div key={item.name}>
                                        <input
                                            type="radio"
                                            value={item.value}
                                            checked={mapStyle === item.value}
                                            onChange={mapStyleChangeHandler}
                                        /> {item.name}
                                    </div>
                                )
                            })

                        }


                    </form>

                :
                <p>Loading</p>
            }



        </Fragment>



    )
}

export default React.memo(MapStyleSelector);