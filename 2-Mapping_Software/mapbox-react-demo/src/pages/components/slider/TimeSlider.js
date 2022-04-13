import Slider from "rc-slider";
import React, { useState, useEffect, Fragment } from "react";

const TimeSlider = ({ timeArray, currentDate, dateSliderHandler, timeScale }) => {


  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const [sliderMarksList, setSliderMarksList] = useState();


  useEffect(() => {


    try {


      // Set slider ticks using max, min, step
      setSliderMarksList(getSliderTicks(timeArray[timeArray.length-1], timeArray[0], 1));

      setIsLoaded(true);

    }
    catch (Exception) {
      setIsLoaded(true);
      setError(true);
    }

  }, [])


  useEffect(() => {


    console.log(timeScale)

      // Set slider ticks using max, min, step
      setSliderMarksList(getSliderTicks(timeArray[timeArray.length-1], timeArray[0], 1));

  }, [timeScale])




  // Create a list of slider marks. The slider marks are the individual filter values in the timeArray
  const getSliderTicks = (max, min, step) =>{
    let marks_obj = {}
    for(let i=min; i<=max; i+=step){
      marks_obj[i] = i.toString();
    };
    return marks_obj;
  }


  return (
    <Fragment >

      {isLoaded ?

        error ?
          <p>Error! Unable to load slider.</p>
          :
          <Slider
            min={timeArray[0]}
            max={timeArray[timeArray.length - 1]}
            value={currentDate}
            onChange={dateSliderHandler}
            dots={true}
            marks={sliderMarksList}

          />

        :
        <p>Loading</p>
      }



    </Fragment>



  )
};

export default React.memo(TimeSlider);
