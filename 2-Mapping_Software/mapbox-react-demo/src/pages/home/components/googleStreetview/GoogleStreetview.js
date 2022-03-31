/*global google*/
import React from 'react';
import { useRef, useState, useEffect } from "react";

const GoogleStreetview = (pointOfInterest) => {

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const streetviewRef = useRef();
  const [streetViewPanorama, setStreetViewPanorama] = useState();


  useEffect(() => {


    let location_coordinates = getLocationCoordinates(pointOfInterest);

    setStreetViewPanorama(new google.maps.StreetViewPanorama(
      streetviewRef.current, {
      position: location_coordinates,
      pov: {
        heading: 34,
        pitch: 10
      }
    }))
  }, [])


  useEffect(() => {


    const location_coordinates = getLocationCoordinates(pointOfInterest);
    if (streetViewPanorama != null) {
      streetViewPanorama.setPosition(location_coordinates);
    }



  }, [pointOfInterest])


  function getLocationCoordinates(pointOfInterest) {

    let coordinates = [];
    if (pointOfInterest.pointOfInterest._geometry.type == 'LineString') {
      // If the point of interest is a line, get the coordinates of the first point
      coordinates = pointOfInterest.pointOfInterest._geometry.coordinates[0];
    }
    else if (pointOfInterest.pointOfInterest._geometry.type == 'Point') {
      // If the point of interest is a point, get the coordinates of the point
      coordinates = pointOfInterest.pointOfInterest._geometry.coordinates;
    }
    else if (pointOfInterest.pointOfInterest._geometry.type == 'Polygon') {
      // If the point of interest is a point, get the coordinates of the point
      coordinates = pointOfInterest.pointOfInterest._geometry.coordinates[0][0];

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