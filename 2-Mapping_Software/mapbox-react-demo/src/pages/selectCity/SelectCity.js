import React from 'react'
import { Outlet, Link } from "react-router-dom";

const SelectCity = () => {
  return (
    <div className="p-10">


      <div className='grid grid-cols-4  gap-4'>

      <div className="col-span-4 md:col-span-1  rounded overflow-hidden shadow-lg">
          <img className="w-full h-64 object-none" src={`http://localhost:3000/assets/images/Kingston.jpg`} alt="Layer Image" />

          <div className="p-4">
            <p className="font-bold mb-2">Kingston</p>
            <p>View data displayed on maps to better visualize the city and surrounding area.</p>

            <Link to="0" className={'border  block w-full text-center p-3 my-1 rounded-md bg-blue-500 hover:bg-blue-700 color-white'} >
              View Map
            </Link>
          </div>
        </div>
        

        <div className="col-span-4 md:col-span-1  rounded overflow-hidden shadow-lg">
          <img className="w-full h-64 object-none" src={`http://localhost:3000/assets/images/Vancouver.jpg`} alt="Layer Image" />

          <div className="p-4">
            <p className="font-bold mb-2">Vancouver</p>
            <p>View data displayed on maps to better visualize the city and surrounding area.</p>

            <Link to="1" className={'border  block w-full text-center p-3 my-1 rounded-md bg-blue-500 hover:bg-blue-700 color-white'} >
              View Map
            </Link>
          </div>
        </div>


        <div className="col-span-4 md:col-span-1  rounded overflow-hidden shadow-lg">
          <img className="w-full h-64 object-none" src={`http://localhost:3000/assets/images/Chicago.jpg`} alt="Layer Image" />

          <div className="p-4">
            <p className="font-bold mb-2">Chicago</p>
            <p>View data displayed on maps to better visualize the city and surrounding area.</p>

            <Link to="2" className={'border  block w-full text-center p-3 my-1 rounded-md bg-blue-500 hover:bg-blue-700 color-white'} >
              View Map
            </Link>
          </div>
        </div>




      </div>








    </div>
  )
}

export default SelectCity