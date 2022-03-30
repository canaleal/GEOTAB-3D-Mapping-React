/*global google*/
import React from 'react';
import { useRef, useState, useEffect } from "react";

const GoogleStreetview = (pointOfInterest) => {

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const streetviewRef = useRef();


  useEffect(() => {

    try{
     
      let coordinates = [];
      if(pointOfInterest.pointOfInterest._geometry.type == 'LineString'){
        // If the point of interest is a line, get the coordinates of the first point
         coordinates = pointOfInterest.pointOfInterest._geometry.coordinates[0];
      }
      else{
        // If the point of interest is a point, get the coordinates of the point
         coordinates = pointOfInterest.pointOfInterest._geometry.coordinates;
      }

      // Set the streetview location coordinates using Point of Interest coordinates
      const location_coordinates = { lat: coordinates[1], lng: coordinates[0] };
      

      // Create a new StreetViewService object using the Point of Interest coordinates
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
     
      setIsLoaded(true);
      setError(true);
    }

  }, [pointOfInterest])

  return (
    

    <div ref={streetviewRef} className='h-96 md:h-128 rounded-lg'></div>
  )
}

export default GoogleStreetview;