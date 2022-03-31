/*global google*/
import React from 'react';
import { useRef, useState, useEffect } from "react";

const GoogleStreetview = (pointOfInterest) => {

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const streetviewRef = useRef();
  const [streetViewPanorama, setStreetViewPanorama] = useState();


  useEffect(() => {

    const location_coordinates = getLocationCoordinates(pointOfInterest);
    // Create the StreetViewPanorama and set it to the div element
    setStreetViewPanorama(new google.maps.StreetViewPanorama(
      streetviewRef.current, {
      position: location_coordinates,
      pov: {
        heading: 34,
        pitch: 10
      }
    }));

  }, [])


  useEffect(() => {


    const location_coordinates = getLocationCoordinates(pointOfInterest);
    streetViewPanorama.setPosition(location_coordinates);


  }, [pointOfInterest])


  function getLocationCoordinates(pointOfInterest) {
    let coordinates = [];
    if (pointOfInterest.pointOfInterest._geometry.type == 'LineString') {
      // If the point of interest is a line, get the coordinates of the first point
      coordinates = pointOfInterest.pointOfInterest._geometry.coordinates[0];
    }
    else {
      // If the point of interest is a point, get the coordinates of the point
      coordinates = pointOfInterest.pointOfInterest._geometry.coordinates;
    }

    // Set the streetview location coordinates using Point of Interest coordinates
    const location_coordinates = { lat: coordinates[1], lng: coordinates[0] };

    return location_coordinates;
  }

  return (


    <div ref={streetviewRef} className='h-96 md:h-128 rounded-lg'></div>
  )
}

export default React.memo(GoogleStreetview);