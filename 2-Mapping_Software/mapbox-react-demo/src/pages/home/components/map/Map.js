import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { useRef, useState, useEffect } from "react";
import boundary from "./data/city-neighbourhoods.geojson";
import pedestrians from "./data/transit-gtfs-stops-count.geojson";
import buses from "./data/transit-gtfs-routes.geojson";

import RoadProjects from './data/road-ahead-projects-under-construction.geojson';


import 'mapbox-gl/dist/mapbox-gl.css';
import React from "react";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";


mapboxgl.accessToken =
  "pk.eyJ1IjoiY2FuYWxlYWwiLCJhIjoiY2t6Nmg2Z2R4MTBtcDJ2cW9xMXI2d2hqYyJ9.ef3NOXxDnIy4WawQuaFopg";

const Map = ({ cityId, mapStyle, mapBounderies, lng, lat, zoom, years, currentYear, layers, pointOfInterestHandler }) => {

  const mapContainerRef = useRef(null);
  const map = useRef(null);


  // Initialize map when component mounts
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

      //Add the sources and then the layers
      add_map_sources();



    });

    // Clean up on unmount
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


  const add_map_sources = () => {
    //Add 3D terrain and Skybox
    map.current.addSource('mapbox-dem', {
      'type': 'raster-dem',
      'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
      'tileSize': 512,
      'maxzoom': 14
    });


    map.current.addSource("PedestrianData", {
      type: "geojson",
      data: pedestrians,
    });


    map.current.addSource('Buses', {
      'type': 'geojson',
      'data': buses
    });


    let mygeojson = { "type": "FeatureCollection", "features": [] }
    fetch('https://opendatakingston.cityofkingston.ca/api/records/1.0/search/?dataset=capital-planning-points&q=&rows=2000&sort=-capital_program_point&facet=capital_program_point&facet=program_subclass&facet=project_title&facet=project_description&facet=project_planning_from&facet=project_planning_to&facet=planned_construction_from&facet=planned_construction_to&facet=construction_completion_from&facet=construction_completion_to')
      .then(response => response.json())
      .then(data => {



        for (let point of data.records) {
          let coordinate = [parseFloat(point.geometry.coordinates[0]), parseFloat(point.geometry.coordinates[1])];
          let properties = point.fields;

          let feature = { "type": "Feature", "geometry": { "type": "Point", "coordinates": coordinate }, "properties": properties }
          mygeojson.features.push(feature);
        }


        map.current.addSource("CityData", {
          type: "geojson",
          data: mygeojson
        });

        add_map_layers();

      });


  }

  const add_map_layers = () => {

    if(cityId == 0){
        //Add layers
        add_terrain_layer();
        add_building_layer();
        add_boundry_layer();
        add_pedestrian_layer();
        add_bus_route_layer();
        add_city_planning_layer();
    }

    else if (cityId == 1){

      add_terrain_layer();
      add_building_layer();
      add_vancouver_trafficCamera_layer();
      add_vancouver_intersection_layer();
      add_vancouver_development_layer();
    }
    else if (cityId == 2){

      add_terrain_layer();
      add_building_layer();
   
    }

   
    

    //Reset the map size so it goes into full width and height
    map.current.resize();
  }

  const add_terrain_layer = () => {

    // add the DEM source as a terrain layer with exaggerated height
    map.current.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

    // add a sky layer that will show when the map is highly pitched
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


  const add_boundry_layer = () => {
    map.current.addSource("BoundaryData", {
      type: "geojson",
      data: boundary,
    })



    // Add a new layer to visualize the bounderies.
    map.current.addLayer({
      id: "CityBoundaryLayer",
      type: "fill",
      source: "BoundaryData", // reference the data source
      layout: {},
      paint: {
        "fill-color": ["get", "fill"], // blue color fill
        "fill-opacity": 0.3, //Set opacity of the polygon
      },
    });
    // Add a black outline around the polygon.
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

  }

  const add_pedestrian_layer = () => {

    map.current.addLayer(
      {
        id: "PedestriansLayer",
        type: "circle",
        source: "PedestrianData",
        minzoom: 7,
        paint: {
          // Size circle radius by earthquake magnitude and zoom level
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            7,
            ["interpolate", ["linear"], ["get", "count"], 1, 2, 3, 4],
            16,
            ["interpolate", ["linear"], ["get", "count"], 2, 4, 6, 8],
          ],
          // Color circle by earthquake magnitude
          "circle-color": [
            "interpolate",
            ["linear"],
            ["get", "count"],
            100,
            "rgb(116,237,134)",
            200,
            "rgb(217, 161, 77)",
            300,
            "rgb(250, 97, 156)",
            400,
            "rgb(194, 129, 71)",
            500,
            "rgb(168, 28, 48)",
            600,
            "rgb(204, 77, 125)",
            700,
            "rgb(194, 58, 96)",
            800,
            "rgb(180, 40, 68)",
            900,
            "rgb(163, 24, 40)",
            1000,
            "rgb(144, 11, 10)",
          ],
          "circle-stroke-color": "white",
          "circle-stroke-width": 1,
          // Transition from heatmap to circle layer by zoom level
          "circle-opacity": ["interpolate", ["linear"], ["zoom"], 7, 0, 8, 1],
        },
      },
      "waterway-label"
    );

    const small_popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    });
    // When a click event occurs on a feature in the places layer, open a popup at the
    // location of the feature, with description HTML from its properties.
    map.current.on('click', 'PedestriansLayer', (e) => {
      // Copy coordinates array.
      const coordinates = e.features[0].geometry.coordinates.slice();
      const description = `
      <p class="font-bold">${e.features[0].properties.name} </p>
      <span>${e.features[0].properties.year}</span>
      <span>Number of People (AVG/HR) : ${e.features[0].properties.count}</span>
      <img src="${e.features[0].properties.img_url}" alt="TEST" height=auto width="100%"/>
         
      `

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(map.current);

      //If the user clicks a point save it 
      pointOfInterestHandler(e.features[0].properties);
    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.current.on('mouseenter', 'PedestriansLayer', (e) => {
      map.current.getCanvas().style.cursor = 'pointer';
      const coordinates = e.features[0].geometry.coordinates.slice();
      const description = `<span>People (AVG/HR) : ${e.features[0].properties.count}</span>`

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      small_popup
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(map.current);

    });

    // Change it back to a pointer when it leaves.
    map.current.on('mouseleave', 'PedestriansLayer', () => {
      map.current.getCanvas().style.cursor = '';
      small_popup.remove();
    });
  }

  const add_bus_route_layer = () => {
    //Create the roads under development layer

    map.current.addLayer({
      'id': 'BuseRoutesLayer',
      'type': 'line',
      'source': 'Buses',
      'layout': {
        'line-join': 'round',
        'line-cap': 'round'
      },
      'paint': {
        'line-color': '#870113', //Specify road colour
        'line-width': 2 //Specify width of the road
      }
    });
  }

  const add_city_planning_layer = () => {



    map.current.addLayer(
      {
        id: "CityPlanningLayer",
        type: "circle",
        source: "CityData",
        minzoom: 7,
        paint: {
          // Size circle radius by earthquake magnitude and zoom level
          'circle-radius': {
            'base': 6,
            'stops': [
              [12, 6],
              [22, 180]
            ]
          },
          // Color circle by earthquake magnitude
          "circle-color": [
            'match',
            ['get', 'capital_program_point'],
            'Parks and Development',
            '#52fcc3',
            'Utilties Rehabilitation',
            '#223b53',
            'Intersection And Crossing Improvements',
            '#e55e5e',
            'Storm System Improvements',
            '#3bb2d0',
            '#ccc'  /* other */
          ],
          "circle-stroke-color": "white",
          "circle-stroke-width": 1,
          // Transition from heatmap to circle layer by zoom level
          "circle-opacity": ["interpolate", ["linear"], ["zoom"], 7, 0, 8, 1],
        },
      },
      "waterway-label"
    );

    map.current.setLayoutProperty("CityPlanningLayer", 'visibility', 'none');




    const small_popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    });

    // When a click event occurs on a feature in the places layer, open a popup at the
    // location of the feature, with description HTML from its properties.
    map.current.on('click', 'CityPlanningLayer', (e) => {
      // Copy coordinates array.
      const coordinates = e.features[0].geometry.coordinates.slice();
      const description = `<span>${e.features[0].properties.project_description}</span>`

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      small_popup.remove();
      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(map.current);


       
     
    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.current.on('mouseenter', 'CityPlanningLayer', (e) => {
      map.current.getCanvas().style.cursor = 'pointer';
      const coordinates = e.features[0].geometry.coordinates.slice();
      const description = `<span>${e.features[0].properties.project_description}</span>`

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      small_popup
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(map.current);

    });

    // Change it back to a pointer when it leaves.
    map.current.on('mouseleave', 'CityPlanningLayer', () => {
      map.current.getCanvas().style.cursor = '';
      small_popup.remove();
    });

  }



  const add_vancouver_trafficCamera_layer = () => {



    map.current.loadImage(
      'http://cdn.onlinewebfonts.com/svg/img_113951.png',
      (error, image) => {
        if (error) throw error;

        // Add the image to the map style.
        map.current.addImage('camera', image);



        let mygeojson = { "type": "FeatureCollection", "features": [] }
        fetch('https://opendata.vancouver.ca/api/records/1.0/search/?dataset=web-cam-url-links&q=&rows=174')
          .then(response => response.json())
          .then(data => {

            console.log(data)


            for (let point of data.records) {
              let coordinate = [parseFloat(point.fields.geom.coordinates[0]), parseFloat(point.fields.geom.coordinates[1])];
              let properties = point.fields;

              let temp = [];
              temp.push(coordinate[1])
              temp.push(coordinate[0])
              properties['stop_coordinates'] = temp.toString();
              let feature = { "type": "Feature", "geometry": { "type": "Point", "coordinates": coordinate }, "properties": properties }
              mygeojson.features.push(feature);
            }
            console.log(mygeojson)


            map.current.addSource("TrafficLightCameraData", {
              type: "geojson",
              data: mygeojson
            });




            map.current.addLayer({
              'id': 'TrafficLightCameraLayer',
              'type': 'symbol',
              'source': 'TrafficLightCameraData',
              'layout': {
                'icon-image': 'camera',
                'icon-size': 0.015,

              },
              'paint': {
                "text-color": "#0000ff"

              }
            });




            map.current.on('click', 'TrafficLightCameraLayer', (e) => {
              // Copy coordinates array.
              const coordinates = e.features[0].geometry.coordinates.slice();
              const description = `
                
                <span class="block">${e.features[0].properties.geo_local_area}</span>
                <span class="block">${e.features[0].properties.mapid}</span>
                <sapn  class="block">${e.features[0].properties.name}</sapn>
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
                   pointOfInterestHandler(e.features[0].properties);

            });

          })
      });
  }


  const add_vancouver_intersection_layer = () => {

    let mygeojson = { "type": "FeatureCollection", "features": [] }
    fetch('https://opendata.vancouver.ca/api/records/1.0/search/?dataset=street-intersections&q=&rows=6105&facet=geo_local_area')
      .then(response => response.json())
      .then(data => {

        console.log(data)


        for (let point of data.records) {
          let coordinate = [parseFloat(point.fields.geom.coordinates[0]), parseFloat(point.fields.geom.coordinates[1])];
          let properties = point.fields;

          let temp = [];
          temp.push(coordinate[1])
          temp.push(coordinate[0])
          properties['stop_coordinates'] = temp.toString();
          let feature = { "type": "Feature", "geometry": { "type": "Point", "coordinates": coordinate }, "properties": properties }
          mygeojson.features.push(feature);
        }
        console.log(mygeojson)


        map.current.addSource("IntersectionData", {
          type: "geojson",
          data: mygeojson
        });




       

        map.current.addLayer(
          {
            id: "IntersectionLayer",
            type: "circle",
            source: "IntersectionData",
            minzoom: 7,
            paint: {
              // Size circle radius by earthquake magnitude and zoom level
              'circle-radius': {
                'base': 3,
                'stops': [
                  [12, 3],
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

        map.current.setLayoutProperty("IntersectionLayer", 'visibility', 'none');


      })
  }





  const add_vancouver_development_layer = () => {

    map.current.addSource('RoadProjectsData', {
      'type': 'geojson',
      'data': RoadProjects
  });
  map.current.addLayer({
      'id': 'RoadProjectsUnderConstructionLayer',
      'type': 'line',
      'source': 'RoadProjectsData',
      'layout': {
          'line-join': 'round',
          'line-cap': 'round'
      },
      'paint': {
          'line-color': '#000', //Specify road colour
          'line-width': 3 //Specify width of the road
      }
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
      console.log(`Unable to add/remove layers: ${e}`)
    }
  }, [layers]);


  //Fucntion is used to show or hide layers on map
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

  //Function is used to grab data from a certain year
  const yearFilter = () => {


    let filterYear = 0;
    let years_temp = years.map(String);

    if (currentYear.toString() === '0000') {
      //Grab all data
      filterYear = ['match', ['get', 'year'], years_temp, false, true];
      map.current.setFilter('PedestriansLayer', ['all', filterYear]);

    } else if (years_temp.includes(currentYear.toString())) {

      //Grab data specific to a year
      map.current.setFilter('PedestriansLayer', ['==', ['number', ['get', 'year']], parseInt(currentYear)]);

    }
    else {
      console.log('error');
    }
  }

  // If the layer changes (isOn), update the map
  useEffect(() => {
    if (!map.current) return;
    try {
      if (map.current !== undefined && map.current.get) {
        switchLayer();
      }
    }
    catch (e) {
      console.log(`Unable to change mapStyle: ${e}`)
    }
  }, [mapStyle]);


  const switchLayer = () => {
    map.current.once("styledata", add_map_sources);
    map.current.setStyle("mapbox://styles/mapbox/" + mapStyle);
  }


  return (
    <div className="h-full w-full " >
      <div ref={mapContainerRef} className='h-full rounded-lg' />
    </div>

  );
};

export default Map;
