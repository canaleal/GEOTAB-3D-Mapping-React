

import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';

const CityBody = ({ city }) => {
    return (
        <div key={city.link} className="col-span-1  rounded-lg overflow-hidden shadow-lg bg-white">
            <img height='100' weight='auto' className="w-full h-64" src={city.img_path} alt="Layer Image" />

            <div className="p-4">
                <p className="font-bold mb-2">{city.name}</p>
                <p>View data displayed on maps to better visualize the city and surrounding area.</p>

                <Link to={{ pathname: `${city.link}` }} className={'border  block text-center  rounded-md btn-blue'} >
                    View Map
                </Link>
            </div>
        </div>
    )
}



export default CityBody;