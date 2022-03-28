
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { useRef, useState, useEffect } from "react";

import 'mapbox-gl/dist/mapbox-gl.css';
import React from "react";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

import chicagoBoundary from "./data/chicago/chicagoBoundary.geojson";


mapboxgl.accessToken =
    "pk.eyJ1IjoiY2FuYWxlYWwiLCJhIjoiY2t6Nmg2Z2R4MTBtcDJ2cW9xMXI2d2hqYyJ9.ef3NOXxDnIy4WawQuaFopg";

const ChicagoMap = ({ cityId, mapStyle, mapBoundaries, lng, lat, zoom, years, currentYear, months, currentMonth, currentFilterValues, layers, pointOfInterestHandler, chartDataHandler }) => {

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

            add_chicago_map_sources();
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

    
   
    
    const add_chicago_map_sources = () => {

        map.current.addSource('mapbox-dem', {
            'type': 'raster-dem',
            'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
            'tileSize': 512,
            'maxzoom': 14
        });

        map.current.addSource("BoundaryData", {
            type: "geojson",
            data: chicagoBoundary,
        })


        fetch('http://localhost:3000/data/impediments.geojson')
            .then(response => response.json())
            .then(data => {

                map.current.addSource("ImpedimentsData", {
                    type: "geojson",
                    data: data
                });

                chartDataHandler(data['features']);

                setIsLoaded(true);
                add_chicago_map_layers();
            });


    }

    

    const add_chicago_map_layers = () => {

        add_terrain_layer();
        add_building_layer();
        add_boundary_layer();
        add_impediments_layer();

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

    const add_impediments_layer = () => {


        const layerName = 'ImpedimentsLayer'

        map.current.addLayer(
            {
                id: layerName,
                type: "circle",
                source: "ImpedimentsData",
                minzoom: 7,
                paint: {

                    'circle-radius': {
                        'base': 5,

                        'stops': [
                            [12, 4],
                            [22, 180]
                        ]
                    },

                    "circle-color":
                        'blue'
                    ,
                },
            },
            "waterway-label"
        );

        countFilter();


        const small_popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        });

        map.current.on('click', layerName, (e) => {
            // Copy coordinates array.
            const coordinates = e.features[0].geometry.coordinates.slice();
            const description = `

                <span class="block font-bold">Country</span>
                <span class="block">${e.features[0].properties.Country}</span>
                <span class="block font-bold">State</span>
                <span class="block">${e.features[0].properties.State}</span>
                <span class="block font-bold">City</span>
                <span class="block">${e.features[0].properties.City}</span>
                
                <span class="block font-bold">Average Acceleration</span>
                <span class="block">${e.features[0].properties.AvgAcceleration}</span>
               
                `

            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            small_popup.remove()
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
            const description = `<span  class="block">${e.features[0].properties.AvgAcceleration}</span>`

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
                countFilter();
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
                countFilter();
            }
        }
        catch (e) {
            return
        }
    }, [currentMonth]);




    // If the current filter range changes, update the map
    useEffect(() => {
        if (!map.current) return;
        try {
            if (map.current !== undefined) {
                countFilter();
            }
        }
        catch (e) {
            return
        }
    }, [currentFilterValues]);


    //Function is used to grab data from a certain year
    const countFilter = () => {



        let temp_month = currentMonth < 10 ? "0" + currentMonth.toString() : currentMonth.toString();
        //Grab data specific to a filter range
        map.current.setFilter('ImpedimentsLayer', ["all",
            [">=", ['get', 'AvgAcceleration'], currentFilterValues[0]],
            ["<=", ['get', 'AvgAcceleration'], currentFilterValues[1]],
            ['==', ['string', ['get', 'Year']], currentYear.toString()],
            ['==', ['string', ['get', 'Month']], temp_month],

        ])



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
        map.current.once("styledata", add_chicago_map_sources);
        map.current.setStyle("mapbox://styles/mapbox/" + mapStyle);
        
    }


    return (
        <div className="h-full w-full " >
            <div ref={mapContainerRef} className='h-full rounded-lg' />

        </div>

    );
}

export default ChicagoMap;