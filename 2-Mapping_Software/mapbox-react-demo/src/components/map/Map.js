import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { useRef, useState, useEffect } from "react";

mapboxgl.accessToken =
  "pk.eyJ1IjoiY2FuYWxlYWwiLCJhIjoiY2t6Nmg2Z2R4MTBtcDJ2cW9xMXI2d2hqYyJ9.ef3NOXxDnIy4WawQuaFopg";

const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-76.48098);
  const [lat, setLat] = useState(44.22976);
  const [zoom, setZoom] = useState(15.5);
  const [toggleableLayerIds, setToggleableLayerIds] = useState([])
  useEffect(() => {
    // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox-map-design/ckhqrf2tz0dt119ny6azh975y",
      center: [lng, lat],
      pitch: 45,
      zoom: zoom,
      bearing: -17.6,
    });
  }, []);

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  

  return <div ref={mapContainer} className="map-container h-screen" />;
};

export default Map;
