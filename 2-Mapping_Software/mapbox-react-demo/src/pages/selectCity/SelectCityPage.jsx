import React, { useState } from 'react'
import { Link } from "react-router-dom";
import CityBody from './components/CityBody';

const SelectCity = () => {

  const [cities, setCities] = useState([
    {
      'link': 'Kingston',
      'name': 'Kingston - City',
      'img_path': 'Kingston.webp'

    },
    {
      'link': 'Vancouver',
      'name': 'Vancouver - City',
      'img_path':'Vancouver.webp'

    },
    {
      'link': 'Chicago',
      'name': 'Chicago - City',
      'img_path': 'Chicago.webp'

    },
    {
      'link': 'France',
      'name': 'France - Country',
      'img_path': 'France.webp'

    },

  ])

  



  return (
    <main>
 

      <div className='grid grid-cols-1 md:grid-cols-4  gap-4'>

        {
          cities.map((city => {
            return (
              <CityBody key={city.link} city={city} />
            )
          }))

        }
      </div>

    </main>
  )
}

export default SelectCity