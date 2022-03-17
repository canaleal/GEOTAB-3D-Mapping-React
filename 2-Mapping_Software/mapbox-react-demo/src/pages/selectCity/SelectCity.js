import React, { useState } from 'react'
import { Outlet, Link } from "react-router-dom";

const SelectCity = () => {

  const [cities, setCities] = useState([
    {
      'link': 0,
      'name': 'Kingston',
      'img_path': 'http://localhost:3000/assets/images/City/Kingston.jpg'

    },
    {
      'link': 1,
      'name': 'Vancouver',
      'img_path': 'http://localhost:3000/assets/images/City/Vancouver.jpg'

    },
    {
      'link': 2,
      'name': 'Chicago',
      'img_path': 'http://localhost:3000/assets/images/City/Chicago.jpg'

    },

  ])



  return (
    <div className="p-10">


      <div className='grid grid-cols-4  gap-4'>

        {
          cities.map((city => {
            return (
              <div key={city.link} className="col-span-4 md:col-span-1  rounded overflow-hidden shadow-lg">
                <img className="w-full h-64 object-none" src={city.img_path} alt="Layer Image" />

                <div className="p-4">
                  <p className="font-bold mb-2">{city.name}</p>
                  <p>View data displayed on maps to better visualize the city and surrounding area.</p>

                  <Link to={{ pathname: `${city.link}` }} className={'border  block w-full text-center p-3 my-1 rounded-md bg-blue-500 hover:bg-blue-700 color-white'} >
                    View Map
                  </Link>
                </div>
              </div>


            )
          }))

        }



      </div>

    </div>
  )
}

export default SelectCity