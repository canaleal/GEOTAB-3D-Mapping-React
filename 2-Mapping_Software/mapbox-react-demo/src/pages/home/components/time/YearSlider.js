import Slider from "rc-slider";
import { useState, useEffect } from "react";

const TimeSlider = ({ minYear, maxYear, currentYear, yearSliderHandler }) => {



  return (
    

        <Slider
          min={minYear}
          max={maxYear}

          value={currentYear}
          onChange={yearSliderHandler}
          dots={true}
          railStyle={{ background: "#d1d1d1", height: 12 }}

          trackStyle={{
            transition: "0.3s ease background-color",
            height: 12,
            background: "#d1d1d1",
          }}


          handleStyle={{
            height: 20,
            width: 20,
            borderRadius: "50%",
            background: "#3b82f6",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.9)",
            border: "none",
          }}

          dotStyle={{
            height: 15,
            width: 2,
            border: 0,
            marginBottom: 11,
            backgroundColor: "#d1d1d1",
            transform: "translateX(0rem)",
          }}
          className="-translate-y-1"
        />

             
  )
};

export default TimeSlider;
