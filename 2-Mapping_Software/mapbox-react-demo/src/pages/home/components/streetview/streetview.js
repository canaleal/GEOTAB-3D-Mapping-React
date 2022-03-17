/*global google*/
import React from 'react';
import { useRef, useState, useEffect } from "react";

const Streetview = (pointOfInterest) => {


  useEffect(() => {

    const coords_raw = pointOfInterest.pointOfInterest['stop_coordinates'].split(",");
    const coordinates = coords_raw.map(Number);
    const location_coordinates = { lat: coordinates[0], lng: coordinates[1] };

    new google.maps.StreetViewPanorama(
      document.getElementById("streetview"), {
      position: location_coordinates,
      pov: {
        heading: 34,
        pitch: 10
      }
    });

  }, [pointOfInterest])

  return (
    <div id="streetview" className='h-128 rounded-lg'></div>
  )
}

export default Streetview;