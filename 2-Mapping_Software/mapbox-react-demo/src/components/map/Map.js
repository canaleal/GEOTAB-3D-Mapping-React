import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { useRef, useState, useEffect } from "react";

mapboxgl.accessToken =
  "pk.eyJ1IjoiY2FuYWxlYWwiLCJhIjoiY2t6Nmg2Z2R4MTBtcDJ2cW9xMXI2d2hqYyJ9.ef3NOXxDnIy4WawQuaFopg";

const Map = () => {
  const mapContainer = useRef(null);
  const [lng, setLng] = useState(-76.48098);
  const [lat, setLat] = useState(44.22976);
  const [zoom, setZoom] = useState(15.5);
  





  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox-map-design/ckhqrf2tz0dt119ny6azh975y',
      center: [lng, lat],
      zoom: zoom
    });

    map.on('load', () => {

       

        // Add zoom and rotation controls to the map.
        map.addControl(new mapboxgl.NavigationControl(), 'top-right');

         // Add full screen controls to the map
         map.addControl(new mapboxgl.FullscreenControl(), 'top-right');




         map.addSource('mapbox-dem', {
          'type': 'raster-dem',
          'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
          'tileSize': 512,
          'maxzoom': 14
        });
        // add the DEM source as a terrain layer with exaggerated height
        map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });




        map.addSource('Boundry', {
          'type': 'geojson',
          'data': 'url',
      });
  
      // Add a new layer to visualize the bounderies.
      map.addLayer({
          'id': 'Boundry',
          'type': 'fill',
          'source': 'Boundry', // reference the data source
          'layout': {},
          'paint': {
              'fill-color': ['get', 'fill'], // blue color fill
              'fill-opacity': 0.3 //Set opacity of the polygon
          }
      });
      // Add a black outline around the polygon.
      map.addLayer({
          'id': 'outline',
          'type': 'line',
          'source': 'Boundry',
          'layout': {},
          'paint': {
              'line-color': '#ffffff',
              'line-width': 1
          }
      });


         map.resize()

    })

    

    map.on('move', () => {
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
    });

    // Clean up on unmount
    return () => map.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <div ref={mapContainer} className="h-full w-full" />;
};

export default Map;
