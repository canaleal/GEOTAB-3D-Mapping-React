import Slider from "rc-slider";
import { useState, useEffect } from "react";

const TimeSlider = ({ timeArray, currentDate, dateSliderHandler }) => {


  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const [sliderMarksList, setSliderMarksList] = useState();
  const [minDate, setMinDate] = useState();
  const [maxDate, setMaxDate] = useState();

  useEffect(() => {


    try {

      // Create a list of slider marks. The slider marks are the individual dates in the timeArray
      let marks_obj = {}
      const time_length = timeArray.length;
      for (let i = 0; i < time_length; i++) {
        marks_obj[timeArray[i]] = timeArray[i].toString();
      };
      setSliderMarksList(marks_obj);

      // Get the min and max date from the timeArray
      setMinDate(timeArray[0]);
      setMaxDate(timeArray[timeArray.length - 1]);
      setIsLoaded(true);

    }
    catch (Exception) {
      setIsLoaded(true);
      setError(true);
    }

  }, [])


  return (
    <div >

      {isLoaded ?

        error ?
          <p>Error! Unable to load slider.</p>
          :
          <Slider
            min={minDate}
            max={maxDate}
            value={currentDate}
            onChange={dateSliderHandler}
            dots={true}
            marks={sliderMarksList}

          />

        :
        <p>Loading</p>
      }



    </div>



  )
};

export default TimeSlider;
