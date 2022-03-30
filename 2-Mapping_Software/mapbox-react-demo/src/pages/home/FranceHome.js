import React, { Fragment } from "react";

import { useState, useEffect, useRef } from "react";

import Cover from "../../components/Cover";
import LayerModal from "./components/layer/LayerModal";

import "rc-slider/assets/index.css";
import Header from "../../components/Header";
import AboutModal from "../../components/AboutModal";
import HelpModal from "../../components/HelpModal";
import Footer from "../../components/Footer";
import Streetview from "./components/streetview/Streetview";
import { useParams } from "react-router-dom";
import LayerButtonGroup from "./components/layer/LayerButtonGroup";
import MapStyleSelector from "./components/map/MapStyleSelector";
import FranceMap from "./components/map/FranceMap";
import RangeSlider from "./components/slider/RangeSlider";

const FranceHome = () => {

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
    const [months, setMonths] = useState([]);
    const [currentMonth, setCurrentMonth] = useState();

    //Timer details
    const [isTimerActive, setIsTimerActive] = useState(false);


    //Filter values
    const [currentFilterValues, setCurrentFilterValues] = useState();
    const [filterDetails, setFilterDetails] = useState({ 'min': 0, 'max': 2, 'step': 0.25 });


    useEffect(() => {



        setCity('France');
        setZoom(5)
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
                layer: "Regions Boundary",
                isOn: true,
                isDynamic: false,
                layerName: "CityBoundaryLayer",
                imgPath: "Boundary.JPG",
                showButton: true,
                icon: "fa-border-all",
            },
            {
                id: 3,
                layer: "Road Impediments",
                isOn: true,
                isDynamic: false,
                layerName: "ImpedimentsLayer",
                imgPath: "Intersections.JPG",
                showButton: true,
                icon: "fa-road",
            }

        ]);


        setLng(2.349014);
        setLat(48.864716);

        setYears([2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022]);
        setCurrentYear(2020);

        setMonths([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
        setCurrentMonth(1);


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
        console.log("🚀 ~ file: Home.js ~ line 298 ~ chartDataHandler ~ value", value)

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

    const filterValueSliderHandler = (item) => {

        setCurrentFilterValues(item);
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
                staticLayers={layers.filter((item) => item.isDynamic == false)}
                dynamicLayers={layers.filter((item) => item.isDynamic == true)}
                layerButtonHandler={layerButtonHandler}
            />

            {isLoaded ?
                <div className="p-5">
                    <div className="grid grid-cols-4 grid-row-3 gap-4 ">
                        <div className="col-span-4  md:col-span-1  border bg-white rounded-lg p-4">
                            <LayerButtonGroup layers={layers} layerModalRef={layerModalRef} layerHandler={layerHandler} showModalHandler={showModalHandler} />
                        </div>




                        <div className="col-span-4 md:col-span-3 row-span-3 border bg-white rounded-lg h-[32rem] md:h-screen slide-in-right relative">


                            <FranceMap
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

                        </div>


                        <div className="col-span-4 md:col-span-1 border bg-white rounded-lg p-4 slide-in-left">
                            <p className="font-bold">Filter Map - Average Acceleration </p>


                            <div className="pb-4 px-4">
                                <RangeSlider
                                    filterDetails={filterDetails}
                                    currentFilterValues={currentFilterValues}
                                    filterValueSliderHandler={filterValueSliderHandler}
                                />
                            </div>


                        </div>

                    </div>


                    {pointOfInterest != null ?
                        <div className="col-span-4 md:col-span-1  border bg-white rounded-lg p-4 slide-in-left">
                            <p className="font-bold">Point Of Interest</p>
                            <Streetview pointOfInterest={pointOfInterest} />
                        </div>
                        :
                        <span></span>
                    }
                </div>

                :
                <div className='p-5'>
                    <p>Unable to Load Map</p>
                </div>
            }

            <Footer
                showModalHandler={showModalHandler}
                aboutModalRef={aboutModalRef}
                helpModalRef={helpModalRef}
            />
        </Fragment>
    );
};

export default FranceHome;
