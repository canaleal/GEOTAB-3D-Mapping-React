import Slider from "rc-slider";
import { useState, useEffect } from "react";

const TimeSlider = ({timeArray,  currentDate, dateSliderHandler }) => {


  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const [marksObject, setMarksObject] = useState();
  const [minDate, setMinDate] = useState();
  const [maxDate, setMaxDate] = useState();

  useEffect(() => {
    
    let marks_obj = {}
    for(let i=0; i<timeArray.length; i++){
      marks_obj[timeArray[i]] = timeArray[i].toString();
    };


    setMinDate(timeArray[0]);
    setMaxDate(timeArray[timeArray.length - 1]);
    
    setMarksObject(marks_obj);
    setIsLoaded(true);
  }, [])
  

  return (
    <div >

      {isLoaded ?

        error ?
          <p>Error! Unable to load projects.</p>
          :
          <Slider
          min={minDate}
          max={maxDate}
          value={currentDate}
          onChange={dateSliderHandler}
          dots={true}
          marks={marksObject}
    
        />

        :
        <p>Loading</p>
      }



    </div>

   

  )
};

export default TimeSlider;
