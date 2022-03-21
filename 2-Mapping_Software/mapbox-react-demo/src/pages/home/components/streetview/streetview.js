/*global google*/
import React from 'react';
import { useRef, useState, useEffect } from "react";

const Streetview = (pointOfInterest) => {

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const streetviewRef = useRef();


  useEffect(() => {

    try{
      const coordinates = pointOfInterest.pointOfInterest._geometry.coordinates;
      const location_coordinates = { lat: coordinates[1], lng: coordinates[0] };

      new google.maps.StreetViewPanorama(
        streetviewRef.current, {
        position: location_coordinates,
        pov: {
          heading: 34,
          pitch: 10
        }
      });

      setIsLoaded(true);
      setError(false);
    }
    catch (Exception){
      console.log(Exception)
      setIsLoaded(true);
      setError(true);
    }

  }, [pointOfInterest])

  return (
    

    <div ref={streetviewRef} className='h-128 rounded-lg'></div>
  )
}

export default Streetview;