import React from 'react';
import { useRef, useState, useEffect } from "react";

const Streetview = ({poi}) => {
    const streetviewRef = useRef();
    useEffect(() => {
          var fenway = {lat: 44.2333, lng: -76.5000};
          var coord = poi.features[0].geometry.coordinates.slice();
          var panorama = new google.maps.StreetViewPanorama(
              streetviewRef.current, {
                position: fenway,
                pov: {
                  heading: 34,
                  pitch: 10
                }
              });
        
    }, [])
    
  return (
    <div ref={streetviewRef}></div>
  )
}

export default Streetview