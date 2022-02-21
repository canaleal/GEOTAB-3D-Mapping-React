import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { useRef, useState, useEffect } from "react";



mapboxgl.accessToken =
  "pk.eyJ1IjoiY2FuYWxlYWwiLCJhIjoiY2t6Nmg2Z2R4MTBtcDJ2cW9xMXI2d2hqYyJ9.ef3NOXxDnIy4WawQuaFopg";

const Map = () => {
  const mapContainer = useRef(null);
  const [lng, setLng] = useState(-76.48098);
  const [lat, setLat] = useState(44.22976);
  const [zoom, setZoom] = useState(15.5);
  const [neighbourhoods, setNeighbourhoods] = useState([]);



  useEffect(() => {


    //Used to create the map bounderies
    const map_bounderies = [
      [-76.788, 44.107], // Southwest coordinates
      [-76.170, 44.520] // Northeast coordinates
    ];

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom,
      maxBounds: map_bounderies
    });




    map.on('load', () => {



      // Add zoom and rotation controls to the map.
      map.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add full screen controls to the map
      map.addControl(new mapboxgl.FullscreenControl(), 'top-right');



      //Add Terrain
      map.addSource('mapbox-dem', {
        'type': 'raster-dem',
        'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
        'tileSize': 512,
        'maxzoom': 14
      });
      // add the DEM source as a terrain layer with exaggerated height
      map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });



      // Insert the layer beneath any symbol layer.
      const layers = map.getStyle().layers;
      const labelLayerId = layers.find(
        (layer) => layer.type === 'symbol' && layer.layout['text-field']
      ).id;
      // The 'building' layer in the Mapbox Streets
      // vector tileset contains building height data
      // from OpenStreetMap.
      map.addLayer(
        {
          'id': 'Buildings',
          'source': 'composite',
          'source-layer': 'building',
          'filter': ['==', 'extrude', 'true'],
          'type': 'fill-extrusion',
          'minzoom': 5,
          'paint': {
            'fill-extrusion-color': '#aaa',

            // Use an 'interpolate' expression to
            // add a smooth transition effect to
            // the buildings as the user zooms in.
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'height']
            ],
            'fill-extrusion-base': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'min_height']
            ],
            'fill-extrusion-opacity': 1.0
          }
        },
        labelLayerId
      );
      map.setLayoutProperty('Buildings', 'visibility', 'visible');


      fetch('city-neighbourhoods.geojson'
        , {
          headers: {
            'Content-Type': 'application/geojson',
            'Accept': 'application/geojson'
          }
        }
      )
        .then(function (response) {
          console.log(response)

          return response.json();
        })
        .then(function (myJson) {
          console.log(myJson);
          setNeighbourhoods(myJson)
          //Add the city bounderies layer
          map.addSource('Boundry', {
            'type': 'geojson',
            'data': myJson,
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
        })
    });








    map.resize()





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
