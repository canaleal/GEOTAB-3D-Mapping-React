

import Slider, { Range } from "rc-slider";
import { useState, useEffect } from "react";

const RangeSlider = ({filterDetails, currentFilterValues, filterValueSliderHandler }) => {


  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [marksObject, setMarksObject] = useState();

  useEffect(() => {


    let marks_obj = {}
    
    for(let i=0; i<=filterDetails.max; i+=filterDetails.step){
      marks_obj[i] = i.toString();
    };
   
   
    setMarksObject(marks_obj);
    setIsLoaded(true);
  }, [])
  

  return (
    <div >

      {isLoaded ?

        error ?
          <p>Error! Unable to load projects.</p>
          :
          <Range
          min={filterDetails.min}
          max={filterDetails.max}
          defaultValue={[filterDetails.min,filterDetails.max]}
          value={currentFilterValues}
          onChange={filterValueSliderHandler}
          dots={true}
          step={filterDetails.step}
          marks={marksObject}
          allowCross={false}
        />

        :
        <p>Loading</p>
      }



    </div>

   

  )
};

export default RangeSlider;
