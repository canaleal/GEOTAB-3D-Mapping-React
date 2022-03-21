
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { useRef, useState, useEffect } from "react";

import 'mapbox-gl/dist/mapbox-gl.css';
import React from "react";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

import vancouverBoundary from "./data/vancouverBoundary.geojson";


mapboxgl.accessToken =
    "pk.eyJ1IjoiY2FuYWxlYWwiLCJhIjoiY2t6Nmg2Z2R4MTBtcDJ2cW9xMXI2d2hqYyJ9.ef3NOXxDnIy4WawQuaFopg";

const VancouverMap = ({ cityId, mapStyle, mapBoundaries, lng, lat, zoom, years, currentYear, months, currentMonth, layers, pointOfInterestHandler, chartDataHandler }) => {

    const mapContainerRef = useRef(null);
    const map = useRef(null);

    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        map.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: `mapbox://styles/mapbox/${mapStyle}`,
            center: [lng, lat],
            zoom: zoom,
        })

        map.current.on('load', () => {
            //Add controls like zoom in and out
            add_map_controls();

            add_vancouver_map_sources();
        });

        return () => map.current.remove();
    }, []);

    const add_map_controls = () => {
        // Include Static Components that wont be re-rendered   
        map.current.addControl(new mapboxgl.FullscreenControl(), 'bottom-right');
        map.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

        //Geocoder is used to specify the address
        const geocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            language: 'en',
            mapboxgl: mapboxgl
        });
        map.current.addControl(geocoder, 'top-right');
    }

    const add_vancouver_map_sources = () => {

        map.current.addSource('mapbox-dem', {
            'type': 'raster-dem',
            'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
            'tileSize': 512,
            'maxzoom': 14
          });
      
         
      
      
          map.current.addSource("BoundaryData", {
            type: "geojson",
            data: vancouverBoundary,
          })

      
          map.current.loadImage(
            'http://cdn.onlinewebfonts.com/svg/img_113951.png',
            (error, image) => {
              if (error) throw error;
      
              map.current.addImage('camera', image);
      
              
              fetch('https://opendata.vancouver.ca/api/records/1.0/search/?dataset=web-cam-url-links&q=&rows=174')
                .then(response => response.json())
                .then(data => {
      
                    let geojson = { "type": "FeatureCollection", "features": [] }
                  for (let point of data.records) {
                    let coordinate = [parseFloat(point.fields.geom.coordinates[0]), parseFloat(point.fields.geom.coordinates[1])];
                    let properties = point.fields;
                    let temp = [coordinate[1], coordinate[0]];
                    properties['stop_coordinates'] = temp.toString();
                    let feature = { "type": "Feature", "geometry": { "type": "Point", "coordinates": coordinate }, "properties": properties }
                    geojson.features.push(feature);
                  }
      
      
                  map.current.addSource("TrafficLightCameraData", {
                    type: "geojson",
                    data: geojson
                  });
      
                })
            });
      
      
      
      
      
          fetch('https://opendata.vancouver.ca/api/records/1.0/search/?dataset=street-intersections&q=&rows=6105&facet=geo_local_area')
            .then(response => response.json())
            .then(data => {
      
              let geojson = { "type": "FeatureCollection", "features": [] }
              for (let point of data.records) {
                let coordinate = [parseFloat(point.fields.geom.coordinates[0]), parseFloat(point.fields.geom.coordinates[1])];
                let properties = point.fields;
                let temp = [coordinate[1], coordinate[0]];
                properties['stop_coordinates'] = temp.toString();
                let feature = { "type": "Feature", "geometry": { "type": "Point", "coordinates": coordinate }, "properties": properties }
                geojson.features.push(feature);
              }
              console.log(geojson)
      
      
              map.current.addSource("IntersectionData", {
                type: "geojson",
                data: geojson
              });
      
      
              add_vancouver_map_layers()
      
            })
      

    }


    const add_vancouver_map_layers = () => {

        add_terrain_layer();
        add_building_layer();
        add_boundary_layer();
        add_vancouver_trafficCamera_layer();
        add_vancouver_intersection_layer();

        map.current.resize();
    }

    const add_terrain_layer = () => {


        map.current.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
        map.current.addLayer({
            'id': 'sky',
            'type': 'sky',
            'paint': {
                'sky-type': 'atmosphere',
                'sky-atmosphere-sun': [0.0, 0.0],
                'sky-atmosphere-sun-intensity': 15
            }
        });

    }


    const add_building_layer = () => {
        // Insert the layer beneath any symbol layer.
        const layers = map.current.getStyle().layers;
        const labelLayerId = layers.find(
            (layer) => layer.type === "symbol" && layer.layout["text-field"]
        ).id;

        map.current.addLayer(
            {
                id: "BuildingsLayer",
                source: "composite",
                "source-layer": "building",
                filter: ["==", "extrude", "true"],
                type: "fill-extrusion",
                minzoom: 5,
                paint: {
                    "fill-extrusion-color": "#aaa",

                    // Use an 'interpolate' expression to
                    // add a smooth transition effect to
                    // the buildings as the user zooms in.
                    "fill-extrusion-height": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        15,
                        0,
                        15.05,
                        ["get", "height"],
                    ],
                    "fill-extrusion-base": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        15,
                        0,
                        15.05,
                        ["get", "min_height"],
                    ],
                    "fill-extrusion-opacity": 1.0,
                },
            },
            labelLayerId
        );

    }


    const add_boundary_layer = () => {

        const layerName = 'CityBoundaryLayer'

        map.current.addLayer({
            id: layerName,
            type: "fill",
            source: "BoundaryData",
            layout: {},
            paint: {
                "fill-color": ["get", "fill"],
                'fill-opacity': [
                    'case',
                    ['boolean', ['feature-state', 'hover'], false],
                    0.8,
                    0.5
                ]

            },
        });

        map.current.addLayer({
            id: "outline",
            type: "line",
            source: "BoundaryData",
            layout: {},
            paint: {
                "line-color": "#ffffff",
                "line-width": 1,
            },
        });



        let hoveredStateId = null;
        // When the user moves their mouse over the state-fill layer, we'll update the
        // feature state for the feature under the mouse.
        map.current.on('mousemove', layerName, (e) => {
            if (e.features.length > 0) {
                if (hoveredStateId !== null) {
                    map.current.setFeatureState(
                        { source: 'BoundaryData', id: hoveredStateId },
                        { hover: false }
                    );
                }

                hoveredStateId = e.features[0].id;
                map.current.setFeatureState(
                    { source: 'BoundaryData', id: hoveredStateId },
                    { hover: true }
                );
            }
        });

        // When the mouse leaves the state-fill layer, update the feature state of the
        // previously hovered feature.
        map.current.on('mouseleave', layerName, () => {
            if (hoveredStateId !== null) {
                map.current.setFeatureState(
                    { source: 'BoundaryData', id: hoveredStateId },
                    { hover: false }
                );
            }
            hoveredStateId = null;
        });

    }


    const add_vancouver_trafficCamera_layer = () => {
        const layerName = 'TrafficLightCameraLayer'
    
    
    
        map.current.addLayer({
          'id': layerName,
          'type': 'symbol',
          'source': 'TrafficLightCameraData',
          'layout': {
            'icon-image': 'camera',
            'icon-size': 0.015,
    
          },
    
        });
    
    
    
    
        map.current.on('click', layerName, (e) => {
          // Copy coordinates array.
          const coordinates = e.features[0].geometry.coordinates.slice();
          const description = `
                    
                    <span class="block">${e.features[0].properties.geo_local_area}</span>
                    <span class="block">${e.features[0].properties.mapid}</span>
                    <span  class="block">${e.features[0].properties.name}</span>
                    <a class="border  block w-full text-center p-3 my-1 rounded-md bg-blue-500 hover:bg-blue-700 color-white" href="${e.features[0].properties.url}" target="_blank" >Traffic Link</a>
                    
                    
                    `
    
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }
    
    
          new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map.current);
    
          //If the user clicks a point save it 
          pointOfInterestHandler(e.features[0]);
    
        });
    
        map.current.on('mouseenter', layerName, () => {
          map.current.getCanvas().style.cursor = 'pointer';
        });
    
        map.current.on('mouseleave', layerName, () => {
          map.current.getCanvas().style.cursor = '';
        });
    
    
      }
    
    
      const add_vancouver_intersection_layer = () => {
        const layerName = 'IntersectionLayer'
    
    
        map.current.addLayer(
          {
            id: layerName,
            type: "circle",
            source: "IntersectionData",
            minzoom: 7,
            paint: {
              // Size circle radius by earthquake magnitude and zoom level
              'circle-radius': {
                'base': 3,
                'stops': [
                  [12, 5],
                  [22, 90]
                ]
              },
              // Color circle by earthquake magnitude
              "circle-color":
                'red'
              ,
    
            },
          },
          "waterway-label"
        );
    
        map.current.setLayoutProperty(layerName, 'visibility', 'none');


        map.current.on('click', layerName, (e) => {
            // Copy coordinates array.
            const coordinates = e.features[0].geometry.coordinates.slice();
            const description = `
                      
                      <span class="block">${e.features[0].properties.geo_local_area}</span>
                      <span class="block">${e.features[0].properties.xstreet}</span>
                     
                      `
      
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }
      
      
            new mapboxgl.Popup()
              .setLngLat(coordinates)
              .setHTML(description)
              .addTo(map.current);
      
            //If the user clicks a point save it 
            pointOfInterestHandler(e.features[0]);
      
          });
      
    
        map.current.on('mouseenter', layerName, () => {
            map.current.getCanvas().style.cursor = 'pointer';
          });
      
          map.current.on('mouseleave', layerName, () => {
            map.current.getCanvas().style.cursor = '';
          });
    
      }




    // If the layer changes (isOn), update the map
    useEffect(() => {
        if (!map.current) return;
        try {
            if (map.current !== undefined) {
                layerFilter();
            }
        }
        catch (e) {
            return
        }
    }, [layers]);


    //Function is used to show or hide layers on map
    const layerFilter = () => {
        //Show or hide layer if it's set to on/off
        layers.forEach(function (item) {
            try {
                map.current.setLayoutProperty(item.layerName, 'visibility', `${item.isOn === true && item.showButton === true ? 'visible' : 'none'}`);
            }
            catch (e) {
                return
            }
        });

        //Reset the map size so it goes into full width and height
        map.current.resize();
    }

    // If the year changes, update the map
    useEffect(() => {
        if (!map.current) return;
        try {
            if (map.current !== undefined) {
                yearFilter();
            }
        }
        catch (e) {
            return
        }
    }, [currentYear]);


    // If the year changes, update the map
    useEffect(() => {
        if (!map.current) return;
        try {
            if (map.current !== undefined) {
                monthFilter();
            }
        }
        catch (e) {
            return
        }
    }, [currentMonth]);

    //Function is used to grab data from a certain year
    const yearFilter = () => {

        let filterYear = 0;
        let years_temp = years.map(String);


        if (currentYear.toString() === '0000') {
            //Grab all data
            filterYear = ['match', ['get', 'UpdateDate'], years_temp, false, true];
            map.current.setFilter('ImpedimentsLayer', ['all', filterYear]);
        } else if (years_temp.includes(currentYear.toString())) {
            //Grab data specific to a year
            map.current.setFilter('ImpedimentsLayer', ['==', ['string', ['get', 'Year']], currentYear.toString()]);
        }
        else {
            console.log('error');
        }
    }


    //Function is used to grab data from a certain month
    const monthFilter = () => {
        let temp_month = currentMonth < 10 ? "0" + currentMonth.toString() : currentMonth.toString();
        let months_temp = months.map(String);
        if (months_temp.includes(currentMonth.toString())) {
            map.current.setFilter('ImpedimentsLayer', ['==', ['string', ['get', 'Month']], temp_month]);
        }
        else {
            console.log('error');
        }
    }

    useEffect(() => {
        if (!map.current) return;
        try {
            if (map.current !== undefined && isLoaded === true) {
                switchLayer();
            }
        }
        catch (e) {
            console.log(`Unable to change mapStyle: ${e}`)
        }
    }, [mapStyle]);


    const switchLayer = () => {
        map.current.once("styledata", add_vancouver_map_sources);
        map.current.setStyle("mapbox://styles/mapbox/" + mapStyle);

    }


    return (
        <div className="h-full w-full " >
            <div ref={mapContainerRef} className='h-full rounded-lg' />

        </div>

    );
}

export default VancouverMap;