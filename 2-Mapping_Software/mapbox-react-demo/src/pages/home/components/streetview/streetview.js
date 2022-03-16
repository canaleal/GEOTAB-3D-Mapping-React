/*global google*/
import React from 'react';
import { useRef, useState, useEffect } from "react";

const Streetview = (pointOfInterest) => {
    const streetviewRef = useRef();
    useEffect(() => {
         
          console.log(pointOfInterest.pointOfInterest);
          const coords_raw = pointOfInterest.pointOfInterest['stop_coordinates'].split(",");
          console.log(coords_raw)
          const coordinates = coords_raw.map(Number);
          console.log(coordinates)

          var fenway = {lat: coordinates[0], lng: coordinates[1]};
          var panorama = new google.maps.StreetViewPanorama(
             document.getElementById("streeview"), {
                position: fenway,
                pov: {
                  heading: 34,
                  pitch: 10
                }
              });
        
    }, [pointOfInterest])
    
  return (
    <div ref={streetviewRef} id="streeview" className='h-128 rounded-lg'></div>
  )
}

export default Streetview;