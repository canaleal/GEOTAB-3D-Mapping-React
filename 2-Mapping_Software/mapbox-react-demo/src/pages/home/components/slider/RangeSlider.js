

import Slider, { Range } from "rc-slider";
import { useState, useEffect } from "react";

const RangeSlider = ({ currentFilterValues, filterValueSliderHandler }) => {


  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [marksObject, setMarksObject] = useState();

  useEffect(() => {


    let marks_obj = {}
    
    for(let i=0; i<=1000; i+=100){
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
          min={0}
          max={1000}
          defaultValue={[0,1000]}
          value={currentFilterValues}
          onChange={filterValueSliderHandler}
          dots={true}
          step={100}
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
