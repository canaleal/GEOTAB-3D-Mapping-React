

import Slider, { Range } from "rc-slider";
import { useState, useEffect } from "react";

const RangeSlider = ({filterDetails, currentFilterValues, filterValueSliderHandler }) => {


  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [sliderMarksList, setSliderMarksList] = useState();

  useEffect(() => {

    try {
      // Create a list of slider marks. The slider marks are the individual filter values in the timeArray
      let marks_obj = {}
      for(let i=0; i<=filterDetails.max; i+=filterDetails.step){
        marks_obj[i] = i.toString();
      };
      setSliderMarksList(marks_obj);
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
          <p>Error! Unable to load range slider.</p>
          :
          <Range
          min={filterDetails.min}
          max={filterDetails.max}
          defaultValue={[filterDetails.min,filterDetails.max]}
          value={currentFilterValues}
          onChange={filterValueSliderHandler}
          dots={true}
          step={filterDetails.step}
          marks={sliderMarksList}
          allowCross={false}
        />

        :
        <p>Loading</p>
      }



    </div>

   

  )
};

export default RangeSlider;
