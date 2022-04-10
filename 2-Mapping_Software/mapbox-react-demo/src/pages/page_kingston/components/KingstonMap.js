
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { useRef, useState, useEffect } from "react";
import boundary from "./data/city_boundary.geojson";
import buses from "./data/bus_routes.geojson";
import crosswalk from './data/crosswalk_lines.geojson';
import princess from './data/princess_arrows.geojson';
import 'mapbox-gl/dist/mapbox-gl.css';
import React from "react";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";


mapboxgl.accessToken =
    "pk.eyJ1IjoiY2FuYWxlYWwiLCJhIjoiY2t6Nmg2Z2R4MTBtcDJ2cW9xMXI2d2hqYyJ9.ef3NOXxDnIy4WawQuaFopg";

const KingstonMap = ({  mapStyle, mapBoundaries, lng, lat, zoom, currentYear, currentFilterValues, layers, pointOfInterestHandler, chartDataHandler }) => {

    const mapContainerRef = useRef(null);
    const map = useRef(null);

    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Create a new map
        map.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: `mapbox://styles/mapbox/${mapStyle}`,
            center: [lng, lat],
            zoom: zoom,
        })
   
        map.current.on('load', () => {
            add_map_controls();
            add_kingston_map_sources();
        });

        return () => map.current.remove();
    }, []);

    // Add map controls and interactions
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

    const add_kingston_map_sources = () => {


        map.current.addSource('mapbox-dem', {
            'type': 'raster-dem',
            'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
            'tileSize': 512,
            'maxzoom': 14
        });

        map.current.addSource("BoundaryData", {
            type: "geojson",
            data: boundary,
        })

        map.current.addSource('Buses', {
            'type': 'geojson',
            'data': buses
        });

        map.current.addSource('CrossWalkData', {
            'type': 'geojson',
            'data': crosswalk
        });

        map.current.addSource('PrincessData', {
            'type': 'geojson',
            'data': princess
        });

        fetch('http://localhost:3000/data/pedestrian.geojson')
            .then(response => response.json())
            .then(data => {

                map.current.addSource("PedestrianData", {
                    type: "geojson",
                    data: data
                });

                chartDataHandler(data['features']);

                
                add_kingston_map_layers();
            });

    }





    const add_kingston_map_layers = () => {

        // Add layers to the map
        add_terrain_layer();
        add_building_layer();
        add_boundary_layer();
        add_pedestrian_layer();
        add_bus_route_layer();
        add_cross_walk_layer();
        add_princess_layer();

        // Add all the filters to the map
        addLayerFilters();
        addMapFilters();

        // Set the map to be loaded
        setIsLoaded(true);
        map.current.resize();
    }


  


    const add_terrain_layer = () => {

        // Add terrain layer and set the exaggeration the layer to 1.5x 
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

        const layerName = 'BuildingsLayer';
        map.current.addLayer(
            {
                id: layerName,
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

        map.current.setLayoutProperty(layerName, 'visibility','none')
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

        map.current.setLayoutProperty(layerName, 'visibility','none')

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

    const add_pedestrian_layer = () => {
        const layerName = 'PedestriansLayer'
        map.current.addLayer(
            {
                id: layerName,
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


        map.current.setLayoutProperty(layerName, 'visibility','none')

     

        const small_popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        });
        // When a click event occurs on a feature in the places layer, open a popup at the
        // location of the feature, with description HTML from its properties.
        map.current.on('click', layerName, (e) => {
            // Copy coordinates array.
            const coordinates = e.features[0].geometry.coordinates.slice();
            const description = `
                    <span class="block font-bold">Street Name</span>
                    <span class="block">${e.features[0].properties.name} </span>
                    <span class="block font-bold">Year</span>
                    <span class="block">${e.features[0].properties.Year}</span>
                    <span class="block font-bold">Average Pedestrian Count</span>
                    <span class="block">${e.features[0].properties.count}</span>
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
            pointOfInterestHandler(e.features[0]);
        });

        // Change the cursor to a pointer when the mouse is over the places layer.
        map.current.on('mouseenter', layerName, (e) => {
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
        map.current.on('mouseleave', layerName, () => {
            map.current.getCanvas().style.cursor = '';
            small_popup.remove();
        });

        
    }

    const add_bus_route_layer = () => {
        //Create the roads under development layer
        const layerName = 'BusRoutesLayer'
        map.current.addLayer({
            'id': layerName,
            'type': 'line',
            'source': 'Buses',
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-color': '#870113', //Specify road color
                'line-width': 2 //Specify width of the road
            }
        });

        map.current.setLayoutProperty(layerName, 'visibility','none')

    }

    const add_cross_walk_layer = () => {
        //Create the roads under development layer
        const layerName = 'CrossWalkLayer'
        map.current.addLayer({
            'id': layerName,
            'type': 'line',
            'source': 'CrossWalkData',
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-color': '#ffffff', //Specify road color
                'line-width': 4 //Specify width of the road
            }
        });

        map.current.setLayoutProperty(layerName, 'visibility','none')

    }



    const add_princess_layer = () => {

        const layerName = 'PrincessBagotLayer'

        map.current.addLayer({
            id: layerName,
            type: "fill",
            source: "PrincessData",
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

     
        map.current.setLayoutProperty(layerName, 'visibility','none')


        const small_popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        });
        // When a click event occurs on a feature in the places layer, open a popup at the
        // location of the feature, with description HTML from its properties.
        map.current.on('click', layerName, (e) => {
            // Copy coordinates array.

          
            const coordinates = e.features[0].geometry.coordinates[0][0].slice();
            const description = `
                    <span class="block font-bold">Year</span>
                    <span class="block">${e.features[0].properties.Year} </span>
                    <span class="block font-bold">Pedestrian Count</span>
                    <span class="block">${e.features[0].properties.count}</span>
                  
                        
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

        // Change the cursor to a pointer when the mouse is over the places layer.
        map.current.on('mouseenter', layerName, (e) => {
            map.current.getCanvas().style.cursor = 'pointer';
            const coordinates = e.features[0].geometry.coordinates[0][0].slice();
            const description = `<span># of Pedestrians: ${e.features[0].properties.count}</span>`

            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            small_popup
                .setLngLat(coordinates)
                .setHTML(description)
                .addTo(map.current);

        });

        // Change it back to a pointer when it leaves.
        map.current.on('mouseleave', layerName, () => {
            map.current.getCanvas().style.cursor = '';
            small_popup.remove();
        });

        
    }




    // If any of the layer in the layerList changes (isOn), update the map
    useEffect(() => {
        if (!map.current) return;
        try {
            addLayerFilters();
        }
        catch (e) {
            return
        }
    }, [layers]);


    //Function is used to show or hide layers on map
    const addLayerFilters = () => {
        //Show or hide layer if it's set to on/off
        layers.forEach(function (layer) {
            map.current.setLayoutProperty(layer.layerName, 'visibility', `${layer.isOn === true ? 'visible' : 'none'}`);
        });

        //Reset the map size so it goes into full width and height
        map.current.resize();
    }



    // If the year changes, update the map
    useEffect(() => {
        if (!map.current) return;
        try {
            addMapFilters();
        }
        catch (e) {
            return
        }
    }, [currentYear, currentFilterValues]);



    //Function is used to grab data from a certain year
    const addMapFilters = () => {

        //Grab data specific to a filter range and year
        map.current.setFilter('PedestriansLayer', ["all",
            [">=", ['get', 'count'], currentFilterValues[0]],
            ["<=", ['get', 'count'], currentFilterValues[1]],
            ['==', ['string', ['get', 'Year']], currentYear.toString()],

        ])


        map.current.setFilter('PrincessBagotLayer', ["all",
            [">=", ['get', 'count'], currentFilterValues[0]],
            ["<=", ['get', 'count'], currentFilterValues[1]],
            ['==', ['string', ['get', 'Year']], currentYear.toString()],

        ])

        //Reset the map size so it goes into full width and height
        map.current.resize();
    }


    useEffect(() => {
        if (!map.current) return;
        try {
            if (isLoaded === true) {
                switchLayer();
            }
        }
        catch (e) {
            console.log(`Unable to change mapStyle: ${e}`)
        }
    }, [mapStyle]);


    const switchLayer = () => {

        //Switch the map style but wait until the map sources are added first
        map.current.once("styledata", add_kingston_map_sources);
        map.current.setStyle("mapbox://styles/mapbox/" + mapStyle);

        addLayerFilters();
        addMapFilters();

        //Reset the map size so it goes into full width and height
        map.current.resize();

    }


    return (
        <div className="h-full w-full map" >
            <div ref={mapContainerRef} className='h-full rounded-lg' />

        </div>

    );
}

export default KingstonMap;