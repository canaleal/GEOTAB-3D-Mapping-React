import React, { Fragment } from "react";

import { useState, useEffect, useRef } from "react";

import Map from "./components/map/Map";
import PedestrianChart from "./components/chart/PedestrianChart";
import TimeSlider from "./components/time/YearSlider";
import LayerButton from "./components/layer/LayerButton";
import Cover from "../../components/Cover";
import LayerModal from "./components/layer/LayerModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "rc-slider/assets/index.css";
import AutoPlayButton from "./components/time/AutoPlayButton";
import Header from "../../components/Header";
import AboutModal from "../../components/AboutModal";
import HelpModal from "../../components/HelpModal";
import Footer from "../../components/Footer";
import Streetview from "./components/streetview/Streetview";
import { useParams } from "react-router-dom";

const Home = () => {
  // Route param
  let { cityId } = useParams();



  const [isLoaded, setIsLoaded] = useState(false);

  //Popuv and black cover
  const layerModalRef = useRef();

  //References for each modal
  const helpModalRef = useRef();
  const aboutModalRef = useRef();

  const coverRef = useRef();

  // Initial Map Details
  const [city, setCity] = useState();
  const [mapBounderies, setMapBounderies] = useState([]);
  const [lng, setLng] = useState();
  const [lat, setLat] = useState();

  const [zoom, setZoom] = useState(12);
  const [mapStyle, setMapStyle] = useState("streets-v11");
  const [layers, setLayers] = useState([]);

  //POI Details
  const [pointOfInterest, setPointOfInterest] = useState();

  //Year details
  const [years, setYears] = useState([]);
  const [currentYear, setCurrentYear] = useState();

  //Timer details
  const [isTimerActive, setIsTimerActive] = useState(false);



  useEffect(() => {
    console.log(cityId)

    if (cityId == 0) {
      setCity('Kingston');

      setMapBounderies([
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
          layer: "Pedestrians",
          isOn: true,
          isDynamic: false,
          layerName: "PedestriansLayer",
          imgPath: "Pedestrians.JPG",
          showButton: true,
          icon: "fa-person",
        },
        {
          id: 4,
          layer: "Bus Routes",
          isOn: false,
          isDynamic: false,
          layerName: "BuseRoutesLayer",
          imgPath: "BusRoutes.JPG",
          showButton: false,
          icon: "fa-bus",
        },
        {
          id: 5,
          layer: "City Projects",
          isOn: false,
          isDynamic: true,
          layerName: "CityPlanningLayer",
          imgPath: "CityProjects.JPG",
          showButton: false,
          icon: "fa-building-columns",
        },
      ]);

      setLng(-76.48098);
      setLat(44.22976);

      setYears([2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022]);
      setCurrentYear(2015);

    }
    else if (cityId == 1) {
      setCity('Vancouver');

      setMapBounderies([
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
          layer: "Traffic Cameras",
          isOn: true,
          isDynamic: true,
          layerName: "TrafficLightCameraLayer",
          imgPath: "TrafficCameras.JPG",
          showButton: true,
          icon: "fa-border-all",
        },
        {
          id: 3,
          layer: "Intersections",
          isOn: false,
          isDynamic: false,
          layerName: "IntersectionLayer",
          imgPath: "Intersections.JPG",
          showButton: false,
          icon: "fa-border-all",
        },

        {
          id: 4,
          layer: "Road Projects Under Construction",
          isOn: true,
          isDynamic: false,
          layerName: "RoadProjectsUnderConstructionLayer",
          imgPath: "Intersections.JPG",
          showButton: true,
          icon: "fa-border-all",
        },

      ]);


      setLng(-123.116226);
      setLat(49.246292);

      setYears([2019, 2020, 2021, 2022]);
      setCurrentYear(2020);

    }
    else if (cityId == 2) {
      setCity('Chicago');

      setMapBounderies([
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
          id: 1,
          layer: "Road Impediments",
          isOn: true,
          isDynamic: false,
          layerName: "ImpedimentsLayer",
          imgPath: "Buildings.JPG",
          showButton: true,
          icon: "fa-building",
        }

      ]);


      setLng(-87.6298);
      setLat(41.8781);

      setYears([2019, 2020, 2021, 2022]);
      setCurrentYear(2020);

    }


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
    if (item.id === 3) {
      setPointOfInterest(null);
    }

    setLayers(temp_dict);
  };

  const yearSliderHandler = (value) => {
    setCurrentYear(value);
  };

  //Turn the timer on or off
  function timerToggleHandler() {
    setIsTimerActive(!isTimerActive);
  }

  function timerResetHandler() {
    setCurrentYear(years[0]);
    setIsTimerActive(false);
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

  return (
    <Fragment>
      <Header city={"Kingston"} />

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
        staticLayers={layers.filter((item) => item.isDynamic == false)}
        dynamicLayers={layers.filter((item) => item.isDynamic == true)}
        layerButtonHandler={layerButtonHandler}
      />

      <div className="px-5 py-5">
        <div className="grid grid-cols-4 grid-row-3 gap-4 ">
          <div className="col-span-4 md:col-span-1  border bg-white rounded-lg p-4 slide-in-left">
            <p className="font-bold">Layers</p>
            {layers.map((item) => (
              <span key={item.id}>
                {item.showButton ? (
                  <LayerButton item={item} layerHandler={layerHandler} />
                ) : (
                  <span></span>
                )}
              </span>
            ))}

            <button
              onClick={() => showModalHandler(layerModalRef)}
              className={`border block w-full text-sm text-left p-3 my-1 mt-10 rounded-md border-black-500 bg-slate-0 hover:bg-slate-200`}
            >
              <FontAwesomeIcon
                icon="fa-solid fa-layer-group"
                size="lg"
                width={"2rem"}
              />
              Add Layers
            </button>
          </div>


          {isLoaded ?
            <div className="col-span-4 md:col-span-3 row-span-3 border bg-white rounded-lg h-[32rem] md:h-full slide-in-right relative">



              <Map
                cityId={cityId}
                mapStyle={mapStyle}
                mapBounderies={mapBounderies}
                lng={lng}
                lat={lat}
                zoom={zoom}
                years={years}
                currentYear={currentYear}
                layers={layers}
                pointOfInterestHandler={pointOfInterestHandler}
              />

              <div className="absolute bottom-10 px-20 box-border  w-full">
                <div className="bg-black px-10 py-5  rounded-lg">
                  <TimeSlider
                    minYear={years[0]}
                    maxYear={years[years.length - 1]}
                    currentYear={currentYear}
                    yearSliderHandler={yearSliderHandler}
                  />
                </div>
              </div>
            </div>
            :
            <span></span>
          }






          <div className="col-span-4 md:col-span-1 border bg-white rounded-lg p-4 slide-in-left">
            <p className="font-bold">Counting</p>
            <PedestrianChart years={years} currentYear={currentYear} />
          </div>

          <div className="col-span-4 md:col-span-1 border bg-white rounded-lg p-4 slide-in-left">
            <p className="font-bold">Year - {currentYear}</p>
            <AutoPlayButton
              isTimerActive={isTimerActive}
              timerToggleHandler={timerToggleHandler}
              timerResetHandler={timerResetHandler}
            />
          </div>
        </div>

        {pointOfInterest != null ? (

          <div className="grid grid-cols-4 grid-row-3 gap-4 ">
            <div className="col-span-4 md:col-span-4  border bg-white rounded-lg p-4 slide-in-left">
              <p className="font-bold">Point Of Interest</p>

              <Streetview pointOfInterest={pointOfInterest} />

            </div>
          </div>
        ) : (
          <span></span>
        )}
      </div>

      <Footer
        showModalHandler={showModalHandler}
        aboutModalRef={aboutModalRef}
        helpModalRef={helpModalRef}
      />
    </Fragment>
  );
};

export default Home;
