import React, { useState } from 'react'
import { Link } from "react-router-dom";

const SelectCity = () => {

  const [cities, setCities] = useState([
    {
      'link': 'Kingston',
      'name': 'Kingston - City',
      'img_path': `${window.location.protocol + "//" + window.location.host}/images/City/Kingston.jpg`

    },
    {
      'link': 'Vancouver',
      'name': 'Vancouver - City',
      'img_path': `${window.location.protocol + "//" + window.location.host}/images/City/Vancouver.jpg`

    },
    {
      'link': 'Chicago',
      'name': 'Chicago - City',
      'img_path': `${window.location.protocol + "//" + window.location.host}/images/City/Chicago.jpg`

    },
    {
      'link': 'France',
      'name': 'France - Country',
      'img_path': `${window.location.protocol + "//" + window.location.host}/images/City/France.jpg`

    },

  ])

  



  return (
    <main>


      <div className='grid grid-cols-1 md:grid-cols-4  gap-4'>

        {
          cities.map((city => {
            return (
              <div key={city.link} className="col-span-1  rounded-lg overflow-hidden shadow-lg bg-white">
                <img className="w-full h-64" src={city.img_path} alt="Layer Image" />

                <div className="p-4">
                  <p className="font-bold mb-2">{city.name}</p>
                  <p>View data displayed on maps to better visualize the city and surrounding area.</p>

                  <Link to={{ pathname: `${city.link}` }} className={'border  block text-center  rounded-md btn-blue'} >
                    View Map
                  </Link>
                </div>
              </div>
            )
          }))

        }
      </div>

    </main>
  )
}

export default SelectCity