

import React, { useState, useRef, useEffect, Fragment } from 'react'

import KingstonMap from "./components/map/KingstonMap";
import PedestrianChart from "./components/chart/PedestrianChart";
import TimeSlider from "./components/slider/YearSlider";
import CountRangeSlider from "./components/slider/CountRangeSlider";
import LayerButton from "./components/layer/LayerButton";
import Cover from "../../components/Cover";
import LayerModal from "./components/layer/LayerModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "rc-slider/assets/index.css";
import AutoPlayButton from "./components/slider/AutoPlayButton";
import Header from "../../components/Header";
import AboutModal from "../../components/AboutModal";
import HelpModal from "../../components/HelpModal";
import Footer from "../../components/Footer";
import Streetview from "./components/streetview/Streetview";


const KingstonHome = () => {

  const [isLoaded, setIsLoaded] = useState(false);

  //Popup and black cover
  const layerModalRef = useRef();

  //References for each modal
  const helpModalRef = useRef();
  const aboutModalRef = useRef();

  const coverRef = useRef();

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

  //Timer details
  const [isTimerActive, setIsTimerActive] = useState(false);

  useEffect(() => {


    setCity('Kingston');

    //Map Details
    setZoom(10);
    setMapBoundaries([
      [-76.788, 44.107], // Southwest coordinates
      [-76.17, 44.52], // Northeast coordinates
    ]);
    setLng(-76.48098);
    setLat(44.22976);


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
        isOn: true,
        isDynamic: false,
        layerName: "BusRoutesLayer",
        imgPath: "BusRoutes.JPG",
        showButton: true,
        icon: "fa-bus",
      }
    ]);

    //Chart details
    setYears([2015, 2016, 2017, 2018, 2019, 2020]);
    setCurrentYear(2015);


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
    if (item.layerName === 'PedestriansLayer') {
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

  const chartTimeTogglerHandler = (item) =>{
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
        staticLayers={layers.filter((item) => item.isDynamic === false)}
        dynamicLayers={layers.filter((item) => item.isDynamic === true)}
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
              Add/Remove Layers
            </button>
          </div>


          {isLoaded == true ?
            <div className="col-span-4 md:col-span-3 row-span-2 border bg-white rounded-lg h-[32rem] md:h-full slide-in-right relative">

              <KingstonMap
                cityId={0}
                mapStyle={mapStyle}
                mapBoundaries={mapBoundaries}
                lng={lng}
                lat={lat}
                zoom={zoom}
                years={years}
                currentYear={currentYear}
                layers={layers}
                pointOfInterestHandler={pointOfInterestHandler}
                chartDataHandler={chartDataHandler}
              />

              <div className="absolute top-3 left-3 bg-white rounded-lg p-4">
                <form >      
                  <div>
                    <input
                      type="radio"
                      value="streets-v11"
                      checked={mapStyle === 'streets-v11'}
                      onChange={mapStyleChangeHandler}
                    /> Streets
                  </div>
                  <div>
                    <input
                      type="radio"
                      value="dark-v10"
                      checked={mapStyle === 'dark-v10'}
                      onChange={mapStyleChangeHandler}
                    /> Dark
                  </div>
                  <div>
                    <input  
                    type="radio" 
                    value="outdoors-v11"
                    checked={mapStyle === 'outdoors-v11'}
                    onChange={mapStyleChangeHandler}/> Outdoors
                  </div>
                
               </form>
              </div>



              <div className="absolute bottom-10 px-20 box-border w-full">
                <div className="bg-black px-10 py-4 rounded-lg">
                  
                  <div className='w-64'>
                    <span className='color-white'>Year - {currentYear}</span>
                   
                  </div>

                  <div className="py-4">
                      <TimeSlider
                      
                      minYear={years[0]}
                      maxYear={years[years.length - 1]}
                      currentYear={currentYear}
                      yearSliderHandler={yearSliderHandler}
                    />
                  </div>
                 
                </div>
              </div>




              


            </div>
            :
            <></>
          }





          {chartData != null ?

            <div className="col-span-4 md:col-span-1 border bg-white rounded-lg p-4 slide-in-left">
           
               <p className="font-bold"># of Pedestrians - Average per Hour </p>
              
              <PedestrianChart currentYear={currentYear} chartTime={chartTime} chartData={chartData} />

              <div className="flex mt-2">
                  <button className={`border text-center p-1 my-1  w-1/3  rounded-md ${chartTime === 'year' ? 'bg-blue-500 hover:bg-blue-700 color-white' : 'border-black-500 bg-slate-0 hover:bg-slate-200'}`} onClick={()=>chartTimeTogglerHandler('year')}>
                  <span>Year</span>
                  </button>
                  <button 
                  className={`border text-center p-1 my-1  w-1/3  rounded-md ${chartTime === 'month' ? 'bg-blue-500 hover:bg-blue-700 color-white' : 'border-black-500 bg-slate-0 hover:bg-slate-200'}`}
                  onClick={()=>chartTimeTogglerHandler('month')}>
                    <span>Month</span>
                  </button>
                  <button 
                   className={`border text-center p-1 my-1  w-1/3  rounded-md ${chartTime === 'day' ? 'bg-blue-500 hover:bg-blue-700 color-white' : 'border-black-500 bg-slate-0 hover:bg-slate-200'}`}
                   onClick={()=>chartTimeTogglerHandler('day')}>
                  
                  <span>Day</span>
                  </button>
                </div>
            </div>
            :
            <></>
          }

           
{/* 
          <div className="col-span-4 md:col-span-1 border bg-white rounded-lg p-4 slide-in-left">
            <p className="font-bold">Year - {currentYear}</p>
            <AutoPlayButton
              isTimerActive={isTimerActive}
              timerToggleHandler={timerToggleHandler}
              timerResetHandler={timerResetHandler}
            />
          </div> */}

          {pointOfInterest != null ?
            <div className="col-span-4 md:col-span-4  border bg-white rounded-lg p-4 slide-in-left">
              <p className="font-bold">Point Of Interest</p>
              <Streetview pointOfInterest={pointOfInterest} />
            </div>
            :
            <></>
          }

        </div>
      </div>

      <Footer
        showModalHandler={showModalHandler}
        aboutModalRef={aboutModalRef}
        helpModalRef={helpModalRef}
      />

    </Fragment>
  );
};

export default KingstonHome;