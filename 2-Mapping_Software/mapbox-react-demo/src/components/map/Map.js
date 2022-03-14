import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { useRef, useState, useEffect, Fragment } from "react";
import boundary from "./data/city-neighbourhoods.geojson";
import pedestrians from "./data/transit-gtfs-stops-count.geojson";
import { Skeleton } from "antd";
import React, { Component } from "react";

mapboxgl.accessToken =
  "pk.eyJ1IjoiY2FuYWxlYWwiLCJhIjoiY2t6Nmg2Z2R4MTBtcDJ2cW9xMXI2d2hqYyJ9.ef3NOXxDnIy4WawQuaFopg";

const Map = (props) => {
  const mapContainer = useRef(null);
  const [mapBounderies, setMapBounderies] = useState([
    [-76.788, 44.107], // Southwest coordinates
    [-76.17, 44.52], // Northeast coordinates
  ]);
  const map = useRef(null);
  const [lng, setLng] = useState(-76.48098);
  const [lat, setLat] = useState(44.22976);
  const [zoom, setZoom] = useState(12);
  const [year, setYear] = useState(null);
  const [years, setYears] = useState([2015, 2016, 2017, 2018, 2019, 2020]);
  const [mapReady, setMapReady] = useState(false)

  const add_map_control = () => {
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.current.addControl(new mapboxgl.FullscreenControl(), "top-right");
  };

  const add_terrain_layer = () => {
    map.current.addSource("mapbox-dem", {
      type: "raster-dem",
      url: "mapbox://mapbox.mapbox-terrain-dem-v1",
      tileSize: 512,
      maxzoom: 14,
    });
    map.current.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });
  };

  const add_building_layer = () => {
    // Insert the layer beneath any symbol layer.
    const layers = map.current.getStyle().layers;
    const labelLayerId = layers.find(
      (layer) => layer.type === "symbol" && layer.layout["text-field"]
    ).id;

    map.current.addLayer(
      {
        id: "Buildings",
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
    map.current.setLayoutProperty("Buildings", "visibility", "visible");
  };

  const add_layer_sources = () => {
    map.current.addSource("BoundaryData", {
      type: "geojson",
      data: boundary,
    });

    map.current.addSource("PedestrianData", {
      type: "geojson",
      data: pedestrians,
    });
  };

  const add_boundary_layer = () => {
    // Add a new layer to visualize the bounderies.
    map.current.addLayer({
      id: "Boundary",
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

    map.current.addLayer({
      id: "BoundaryIcon",
      type: "symbol",
      source: "BoundaryData",
      layout: {
        // get the title name from the source's "title" property
        "text-field": ["get", "name"],
        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],

        "text-offset": [0, 1.25],
        "text-anchor": "top",
      },
      paint: {
        "text-color": "#ffffff",
      },
    });

    map.current.setLayoutProperty("Boundary", "visibility", "visible");
  };

  const add_pedestrian_layer = () => {
    map.current.addLayer(
      {
        id: "Pedestrians",
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
            ["interpolate", ["linear"], ["get", "count"], 1, 2, 6, 8],
            16,
            ["interpolate", ["linear"], ["get", "count"], 2, 4, 8, 10],
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

    map.current.setLayoutProperty("Pedestrians", "visibility", "visible");
  };

  const add_toggle_for_pedestrians = () => {
    // When a click event occurs on a feature in the places layer, open a popup at the
    // location of the feature, with description HTML from its properties.
    map.current.on("click", "Pedestrians", (e) => {
      // Copy coordinates array.
      const coordinates = e.features[0].geometry.coordinates.slice();
      const description = `<div class="p-2"><h1>${e.features[0].properties.name} - ${e.features[0].properties.year}</h1><p>Number of People (AVG/HR) : ${e.features[0].properties.count}</p><img src="${e.features[0].properties.img_url}" alt="TEST" height="auto" width="w-full"/></div>`;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(map.current);

      map.current.flyTo({
        center: coordinates,
        essential: true, // this animation is considered essential with respect to prefers-reduced-motion
        zoom: 14,
      });
    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.current.on("mouseenter", "Pedestrians", (e) => {
      map.current.getCanvas().style.cursor = "pointer";
    });

    // Change it back to a pointer when it leaves.
    map.current.on("mouseleave", "Pedestrians", () => {
      map.current.getCanvas().style.cursor = "";
    });
  };

  const add_filter_for_pedestrians = () => {
    let temp_year = year;

    if (years.includes(temp_year)) {
      map.current.setFilter("Pedestrians", [
        "==",
        ["number", ["get", "year"]],
        parseInt(temp_year),
      ]);
    } else {
      console.log("error");
    }
  };

  useEffect(() => {
    console.log('refresh')

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
      maxBounds: mapBounderies,
    });

    map.current.on("load", () => {
      add_map_control();
      add_layer_sources();
      add_terrain_layer();
      add_building_layer();
      add_boundary_layer();
      add_pedestrian_layer();
      add_toggle_for_pedestrians();
      add_filter_for_pedestrians();
      setMapReady(true)
      map.current.resize();
      
    });

    // Clean up on unmount
    return () => map.current.remove();
  }, []);

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  }); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Fragment>
      <div ref={mapContainer} className={`h-full w-full ${mapReady? "":"hidden"}`} />
      {!mapReady && <Skeleton active className="p-5"></Skeleton>}
    </Fragment>
  );
};

export default Map;
