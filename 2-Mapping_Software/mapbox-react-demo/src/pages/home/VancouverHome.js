

import React, { useState, useRef, useEffect, Fragment } from 'react'

import VancouverMap from "./components/map/VancouverMap";
import Cover from "../../components/Cover";
import LayerModal from "./components/layer/LayerModal";

import "rc-slider/assets/index.css";
import Header from "../../components/Header";
import AboutModal from "../../components/AboutModal";
import HelpModal from "../../components/HelpModal";
import Footer from "../../components/Footer";
import GoogleStreetview from "./components/googleStreetview/GoogleStreetview";
import MapStyleSelector from './components/map/MapStyleSelector';
import LayerButtonGroup from './components/layer/LayerButtonGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const VancouverHome = () => {

  const [isLoaded, setIsLoaded] = useState(false);

  //Popup and black cover
  const coverRef = useRef();
  
  const layerModalRef = useRef();
  const helpModalRef = useRef();
  const aboutModalRef = useRef();

 

  // Initial Map Details
  const [city, setCity] = useState();
  const [mapBoundaries, setMapBoundaries] = useState([]);
  const [lng, setLng] = useState();
  const [lat, setLat] = useState();
  const [zoom, setZoom] = useState();
  const [mapStyle, setMapStyle] = useState("streets-v11");
  const [layers, setLayers] = useState([]);

  //POI Details
  const [pointOfInterest, setPointOfInterest] = useState();
  const [chartData, setChartData] = useState(null);
  const [chartTime, setChartTime] = useState('year')

  //Year details
  const [years, setYears] = useState([]);
  const [currentYear, setCurrentYear] = useState();
  const [months, setMonths] = useState([]);
  const [currentMonth, setCurrentMonth] = useState();

  //Timer details
  const [isTimerActive, setIsTimerActive] = useState(false);

  useEffect(() => {


    setCity('Vancouver');
    setZoom(10)
    setMapBoundaries([
      [-76.788, 44.107], // Southwest coordinates
      [-76.17, 44.52], // Northeast coordinates
    ]);

    setLayers([
      {
        id: 1,
        layer: "Buildings",
        isOn: true,
        isDynamic: false,
        layerName: "BuildingsLayer",
        imgPath: "Buildings.JPG",
        showButton: true,
        icon: "fa-building",
    },
    {
        id: 2,
        layer: "City Boundary",
        isOn: true,
        isDynamic: false,
        layerName: "CityBoundaryLayer",
        imgPath: "Boundary.JPG",
        showButton: true,
        icon: "fa-border-all",
    },
      {
        id: 3,
        layer: "Traffic Cameras",
        isOn: true,
        isDynamic: true,
        layerName: "TrafficLightCameraLayer",
        imgPath: "TrafficCameras.JPG",
        showButton: true,
        icon: "fa-camera",
      },
      {
        id: 4,
        layer: "Intersections",
        isOn: false,
        isDynamic: false,
        layerName: "IntersectionLayer",
        imgPath: "Intersections.JPG",
        showButton: false,
        icon: "fa-road",
      },




    ]);


    setLng(-123.116226);
    setLat(49.246292);

    setYears([2022]);
    setCurrentYear(2022);


    setIsLoaded(true);
  }, []);


  // Function is used to turn on or off the layer on the map
  const layerHandler = (item) => {
    // Make a copy of the layers array and find the index of the layer.
    let temp_dict = [...layers];
    let objIndex = temp_dict.findIndex((x) => x.id === item);

    // Turn the layer on or off
    temp_dict[objIndex].isOn = !temp_dict[objIndex].isOn;

    setLayers(temp_dict);
  };

  // Function is used to show or not show the button for each layer
  const layerButtonHandler = (item) => {
    // Make a copy of the layers array and find the index of the layer.
    const temp_dict = [...layers];
    const objIndex = temp_dict.findIndex((x) => x.id === item.id);
    temp_dict[objIndex].showButton = !temp_dict[objIndex].showButton;

    // If the button isn't being displayed, turn it off
    if (temp_dict[objIndex].showButton === false) {
      temp_dict[objIndex].isOn = false;
    }

    //Remove point of interest if the pedestrian layer is turned off
    if (item.layerName === 'TrafficLightCameraLayer') {
      setPointOfInterest(null);
    }

    setLayers(temp_dict);
  };

  const yearSliderHandler = (value) => {
    setCurrentYear(value);
  };

  const monthSliderHandler = (value) => {
    setCurrentMonth(value);
  };

  //Turn the timer on or off
  function timerToggleHandler() {
    setIsTimerActive(!isTimerActive);
  }

  function timerResetHandler() {
    setCurrentYear(years[0]);
    setIsTimerActive(false);
  }

  const chartDataHandler = (value) => {
    setChartData(value);
  }

  useEffect(() => {
    let interval = null;
    if (isTimerActive) {
      interval = setInterval(() => {
        //Increase year and reset if it reaches final year
        if (currentYear === years[years.length - 1]) {
          setCurrentYear(years[0]);
        } else {
          setCurrentYear((year) => year + 1);
        }
      }, 1000);
    } else if (!isTimerActive && currentYear !== years[0]) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, currentYear]);

  const pointOfInterestHandler = (item) => {
    setPointOfInterest(item);
  };

  const showModalHandler = (modal) => {
    modal.current.style.display = "block";
    coverRef.current.style.display = "block";
  };

  const closeModalHandler = (modal) => {
    modal.current.style.display = "none";
    coverRef.current.style.display = "none";
  };

  const mapStyleChangeHandler = (item) => {
    setMapStyle(item.target.value);
  };

  const chartTimeTogglerHandler = (item) => {
    setChartTime(item)
  }

  return (
    <Fragment>
      <Header city={city} />

      <Cover coverRef={coverRef} />
      <AboutModal
        aboutModalRef={aboutModalRef}
        closeModalHandler={closeModalHandler}
      />
      <HelpModal
        helpModalRef={helpModalRef}
        closeModalHandler={closeModalHandler}
      />
      <LayerModal
        layerModalRef={layerModalRef}
        closeModalHandler={closeModalHandler}
        layers={layers}
        layerButtonHandler={layerButtonHandler}
      />

      {isLoaded ?
        <div className="p-5">

          <div className="grid grid-cols-4 grid-row-2 gap-4 ">
            <div className="col-span-4  md:col-span-1  border bg-white rounded-lg p-4">
              <LayerButtonGroup layers={layers} layerModalRef={layerModalRef} layerHandler={layerHandler} showModalHandler={showModalHandler} />
           
           
              <button onClick={() => showModalHandler(layerModalRef)} className={`border   w-full text-left my-1 btn-gray mt-10`}>
                <FontAwesomeIcon
                  icon="fa-solid fa-layer-group"
                  size="xl"
                  width={"2rem"}
                /><span>Add/Remove Layers</span>
              </button>
           
            </div>




            <div className="col-span-4 md:col-span-3 row-span-2 border bg-white rounded-lg h-[32rem] md:h-screen    relative">

              <VancouverMap
                cityId={0}
                mapStyle={mapStyle}
                mapBoundaries={mapBoundaries}
                lng={lng}
                lat={lat}
                zoom={zoom}
                years={years}
                currentYear={currentYear}
                months={months}
                currentMonth={currentMonth}
                layers={layers}
                pointOfInterestHandler={pointOfInterestHandler}
                chartDataHandler={chartDataHandler}
              />

              <div className="absolute top-3 left-3 bg-white rounded-lg p-4">
                <MapStyleSelector mapStyle={mapStyle} mapStyleChangeHandler={mapStyleChangeHandler} />
              </div>


            </div>



        
            {pointOfInterest != null ?
              <div className="col-span-4 md:col-span-4 border bg-white rounded-lg p-4 ">
                <p className="font-bold">Point Of Interest</p>
                <GoogleStreetview pointOfInterest={pointOfInterest} />
              </div>
              :
              <></>
            }

          </div>
        </div>
        :
        <div className='p-5'>
          <p>Unable to Load Map</p>
        </div>
      }

<Footer/>

    </Fragment>
  );
};

export default VancouverHome;