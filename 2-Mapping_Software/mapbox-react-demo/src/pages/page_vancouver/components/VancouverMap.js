
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { useRef, useState, useEffect } from "react";

import 'mapbox-gl/dist/mapbox-gl.css';
import React from "react";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

import { getDataUsingFetch, getVancouverPointDataUsingFetchAndClean } from '../../../util/FetchingData';



mapboxgl.accessToken =
    "pk.eyJ1IjoiY2FuYWxlYWwiLCJhIjoiY2t6Nmg2Z2R4MTBtcDJ2cW9xMXI2d2hqYyJ9.ef3NOXxDnIy4WawQuaFopg";

const VancouverMap = ({ cityId, mapStyle, mapBoundaries, lng, lat, zoom, years, currentYear, currentFilterValues, layers, pointOfInterestHandler, chartDataHandler }) => {

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



    const add_map_images = async (url, name) => {
        map.current.loadImage(
            url,
            (error, image) => {
                if (error) throw error;

                map.current.addImage(name, image);

            }
        );
    }


    const add_vancouver_map_sources = async () => {

         //Reset the map size so it goes into full width and height
         map.current.resize();
         

        map.current.addSource('mapbox-dem', {
            'type': 'raster-dem',
            'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
            'tileSize': 512,
            'maxzoom': 14
        });



  
        let currentLocation = window.location.protocol + "//" + window.location.host;
        let raw_url = currentLocation+ "/data/vancouver/";
        const boundaryData = await getDataUsingFetch(raw_url + "vancouver_boundary.geojson");

        map.current.addSource("BoundaryData", {
            type: "geojson",
            data: boundaryData,
        })


        const IntersectionData = await getVancouverPointDataUsingFetchAndClean('https://opendata.vancouver.ca/api/records/1.0/search/?dataset=street-intersections&q=&rows=6105&facet=geo_local_area');
        map.current.addSource("IntersectionData", {
            type: "geojson",
            data: IntersectionData
        });

        await add_map_images("http://cdn.onlinewebfonts.com/svg/img_113951.png", "camera");
        const TrafficCameraData = await getVancouverPointDataUsingFetchAndClean('https://opendata.vancouver.ca/api/records/1.0/search/?dataset=web-cam-url-links&q=&rows=174');
        map.current.addSource("TrafficLightCameraData", {
            type: "geojson",
            data: TrafficCameraData
        });

        const treesData = await getDataUsingFetch(raw_url + "trees.geojson");
        map.current.addSource('TreesData', {
            'type': 'geojson',
            'data': treesData
        });

        


        add_vancouver_map_layers()
    }


    const add_vancouver_map_layers = () => {

        

        add_terrain_layer();
        add_building_layer();
        add_boundary_layer();
        add_vancouver_trafficCamera_layer();
        add_vancouver_intersection_layer();
        add_trees_layer();

        // Add all the filters to the map
        addLayerFilters();
        addMapFilters();

        // Set the map to be loaded
        setIsLoaded(true);

        map.current.resize();
    }

    const add_terrain_layer = () => {

        // Add terrain layer and set the exaggeration the layer to 1.5x 
        map.current.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.0 });
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

        map.current.setLayoutProperty(layerName, 'visibility', 'none')
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

        map.current.setLayoutProperty(layerName, 'visibility', 'none')

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

        map.current.setLayoutProperty(layerName, 'visibility', 'none')


        map.current.on('click', layerName, (e) => {
            // Copy coordinates array.
            const coordinates = e.features[0].geometry.coordinates.slice();
            const description = `
                    <span class="block font-bold">Local Area</span>
                    <span class="block">${e.features[0].properties.geo_local_area}</span>
                    <span class="block font-bold">Map ID</span>
                    <span class="block">${e.features[0].properties.mapid}</span>
                    <span class="block font-bold">Street Name</span>
                    <span  class="block">${e.features[0].properties.name}</span>
                    <a class="border  block w-full text-center btn-blue" href="${e.features[0].properties.url}" target="_blank" >Traffic Link</a>
                    
                    
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
            let description_raw = ""
            const sliced = Object.fromEntries(
                Object.entries(e.features[0].properties).slice(0, 3)
            );
            for (const [key, value] of Object.entries(sliced)) {
                description_raw += `<span class="block font-bold">${key}</span><span class="block">${value}</span>`
            }


            const description = description_raw;

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


    const add_trees_layer = () => {

        const layerName = 'TreesLayer'

        map.current.addLayer(
            {
                id: layerName,
                type: "circle",
                source: "TreesData",
                minzoom: 7,
                paint: {

                    "circle-radius": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        7,
                        ["interpolate", ["linear"], ["get", "diameter"], 1, 2, 3, 4],
                        16,
                        ["interpolate", ["linear"], ["get", "diameter"], 3, 6, 9, 12],
                    ],

                    "circle-color":
                        'green'
                    ,
                },
            },
            "waterway-label"
        );

        map.current.setLayoutProperty(layerName, 'visibility', 'visible')


        const small_popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        });

        map.current.on('click', layerName, (e) => {
            // Copy coordinates array.
            const coordinates = e.features[0].geometry.coordinates.slice();

            let description_raw = ""
            const sliced = Object.fromEntries(
                Object.entries(e.features[0].properties).slice(0, 5)
            );
            for (const [key, value] of Object.entries(sliced)) {
                description_raw += `<span class="block font-bold">${key}</span><span class="block">${value}</span>`
            }


            const description = description_raw;

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
            const description = `  <span class="block font-bold">Tree Name</span>
            <span  class="block">${e.features[0].properties.common_name}</span>
            `

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
        map.current.setFilter('TreesLayer', ["all",
            [">=", ['get', 'diameter'], currentFilterValues[0]],
            ["<=", ['get', 'diameter'], currentFilterValues[1]]
        
        ])

       
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
        map.current.once("styledata", add_vancouver_map_sources);
        map.current.setStyle("mapbox://styles/mapbox/" + mapStyle);

        addLayerFilters();
        addMapFilters();

      

    }


    return (
        <div className="h-full w-full map" >
            <div ref={mapContainerRef} className='h-full rounded-lg' />

        </div>

    );
}

export default VancouverMap;