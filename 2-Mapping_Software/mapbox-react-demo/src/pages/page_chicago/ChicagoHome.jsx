

import React, { useState, useRef, useEffect, Fragment } from 'react'

import ChicagoMap from "./components/ChicagoMap";
import TimeSlider from "../components/slider/TimeSlider";
import Cover from "../../components/Cover";
import LayerModal from "../components/layer/LayerModal";

import "rc-slider/assets/index.css";
import Header from "../../components/Header";

import GoogleStreetview from "../components/googleStreetview/GoogleStreetview";
import ChartDateToggle from '../components/chart/ChartDateToggle';
import MapStyleSelector from '../components/map/MapStyleSelector';
import ImpedimentsChart from '../components/chart/ImpedimentsChart';
import RangeSlider from '../components/slider/RangeSlider';
import LayerButtonGroup from '../components/layer/LayerButtonGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TimeScaleDropDown from '../components/slider/TimeScaleDropDown';
import { getMonthStringGivenValue } from '../../util/GetMonth';


const ChicagoHome = () => {

  const [isLoaded, setIsLoaded] = useState(false);

  //Popup and black cover
  const layerModalRef = useRef();


  const coverRef = useRef();

  // Initial Map Details
  const [city, setCity] = useState();
  const [mapBoundaries, setMapBoundaries] = useState([]);
  const [lng, setLng] = useState();
  const [lat, setLat] = useState();
  const [zoom, setZoom] = useState();
  const [mapStyle, setMapStyle] = useState("dark-v10");
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
  const [days, setDays] = useState([]);
  const [currentDay, setCurrentDay] = useState();
 
  const [timeScale, setTimeScale] = useState('Year');

  //Timer details
  const [isTimerActive, setIsTimerActive] = useState(false);


  //Filter values
  const [currentFilterValues, setCurrentFilterValues] = useState();
  const [filterDetails, setFilterDetails] = useState({ 'min': 0, 'max': 2, 'step': 0.25 });

  useEffect(() => {


    setCity('Chicago');
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
        imgPath: "Buildings.webp",
        showButton: true,
        icon: "fa-building",
      },
      {
        id: 2,
        layer: "City Boundary",
        isOn: true,
        isDynamic: false,
        layerName: "CityBoundaryLayer",
        imgPath: "Boundary.webp",
        showButton: true,
        icon: "fa-border-all",
      },
      {
        id: 3,
        layer: "Road Impediments",
        isOn: true,
        isDynamic: false,
        layerName: "ImpedimentsLayer",
        imgPath: "Impediments.webp",
        showButton: true,
        icon: "fa-road",
      }

    ]);


    setLng(-87.6298);
    setLat(41.8781);

    setYears([2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022]);
    setCurrentYear(2020);

    setMonths([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
    setCurrentMonth(1);

    setDays([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]);
    setCurrentDay(1);

    //filter details
    setCurrentFilterValues([0, 2])

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
    let temp_dict = [...layers];
    const objIndex = temp_dict.findIndex((x) => x.id === item.id);
    temp_dict[objIndex].showButton = !temp_dict[objIndex].showButton;

    
    // If the button isn't being displayed, turn the layer off from the map
    if (temp_dict[objIndex].showButton === false) {
      temp_dict[objIndex].isOn = false;
    }
    else{
      temp_dict[objIndex].isOn = true;
    } 

   
    setLayers(temp_dict);
  };

  const yearSliderHandler = (value) => {
    setCurrentYear(value);

  };

  const monthSliderHandler = (value) => {
    setCurrentMonth(value);

  };

  const daySliderHandler = (value) => {
    setCurrentDay(value);
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


  const filterValueSliderHandler = (item) => {
    setCurrentFilterValues(item);
  }


  const handleTimeScaleChange = (event) => {
    setTimeScale(event.target.value);
  };


  return (
    <Fragment>
      <Header city={city} color={'bg-blue'}/>

      <Cover coverRef={coverRef} />

      <LayerModal
        layerModalRef={layerModalRef}
        closeModalHandler={closeModalHandler}
        layers={layers}
        layerButtonHandler={layerButtonHandler}
      />

      {isLoaded ?
        <main>

          <div className="grid grid-cols-4 grid-row-3 gap-4 ">
            <div className="col-span-4  md:col-span-1  border bg-white rounded-lg p-4 slide-in-left" style={{'--order': 1}}>
              <LayerButtonGroup layers={layers} layerModalRef={layerModalRef} layerHandler={layerHandler} showModalHandler={showModalHandler} />


              <button onClick={() => showModalHandler(layerModalRef)} className={`border   w-full text-left my-1 btn-gray mt-10`}>
                <FontAwesomeIcon
                  icon="fa-solid fa-layer-group"
                  size="xl"
                  width={"2rem"}
                /><span>Add/Remove Layers</span>
              </button>
            </div>




            <div className="col-span-4 md:col-span-3 row-span-3 border h-128 md:h-full bg-white rounded-lg   relative slide-in-right">

              <ChicagoMap
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
                currentFilterValues={currentFilterValues}
                layers={layers}
                pointOfInterestHandler={pointOfInterestHandler}
                chartDataHandler={chartDataHandler}
              />

              <div className="absolute top-3 left-3 bg-white rounded-lg p-4">
                <MapStyleSelector mapStyle={mapStyle} mapStyleChangeHandler={mapStyleChangeHandler} />
              </div>

              <div className="absolute bottom-10 left-10 bg-black px-10 py-4 rounded-lg box-border w-10/12">
              <div className="flex flex-row justify-between">
                  <span className="color-white">
                    Year - {currentYear}  
                  </span>
                  <span className="color-white">
                  Month - {getMonthStringGivenValue(currentMonth)}
                  </span>

                  <span className="color-white">
                  Day - {currentDay}
                  </span>


                  <TimeScaleDropDown
                    label="Time Scale:"
                    options={[
                      { label: 'Year', value: 'Year' },
                      { label: 'Month', value: 'Month' },
                      { label: 'Day', value: 'Day' },
                    ]}
                    value={timeScale}
                    onChange={handleTimeScaleChange}
                  />

                </div>



                <div className="py-4">
                <TimeSlider
                    timeArray={timeScale === 'Year'?years: timeScale === 'Month'?  months : days}
                    currentDate={timeScale === 'Year'?currentYear: timeScale === 'Month'?  currentMonth : currentDay}
                    dateSliderHandler={timeScale === 'Year'?yearSliderHandler:timeScale === 'Month'?monthSliderHandler: daySliderHandler}
                    timeScale={timeScale}
                  />
                 
                </div>
                
              </div>
            </div>



            <div className="col-span-4 md:col-span-1 border bg-white rounded-lg p-4 slide-in-left" style={{'--order': 2}}>
              <p className="font-bold">Filter Map - Average Acceleration </p>


              <div className="pb-4 px-4">
                <RangeSlider
                  filterDetails={filterDetails}
                  currentFilterValues={currentFilterValues}
                  filterValueSliderHandler={filterValueSliderHandler}
                />
              </div>


            </div>




            <div className="col-span-4 md:col-span-1 border bg-white rounded-lg p-4 slide-in-left" style={{'--order': 3}}>
              {chartData != null ? <Fragment>
                <p className="font-bold">Average Acceleration</p>
                <ImpedimentsChart years={years} currentYear={currentYear} currentMonth={currentMonth} chartTime={chartTime} chartData={chartData} />
                <ChartDateToggle chartTime={chartTime} chartTimeTogglerHandler={chartTimeTogglerHandler} />
              </Fragment>

                : <div className="h-64"><span>Loading Chart Data after Map Loads.</span></div>
              }

            </div>


            {pointOfInterest != null ?
              <div className="col-span-4 md:col-span-4  border bg-white rounded-lg p-4 ">
                <p className="font-bold">Point Of Interest</p>
                <GoogleStreetview pointOfInterest={pointOfInterest} />
              </div>
              :
              <span></span>
            }

          </div>
        </main>
        :
        <div className='p-5'>
          <p>Unable to Load Map</p>
        </div>
      }


    </Fragment>
  );
};

export default ChicagoHome;